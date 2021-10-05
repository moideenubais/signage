const { Log, validate } = require("../models/log");
const _ = require("lodash");
const excel = require("node-excel-export");
const moment = require('moment');

exports.postLog = function (logObject) {
  let log = {};
  log = new Log(logObject);
  if (!_.isUndefined(logObject.updated_object))
    log.markModified("updated_object");
  log.save(function (err, result) {
    if (err) {
      console.log("error while Log.save at log controller", err);
    }
  });
};

exports.deleteLog = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });
  const { startDate, endDate } = req.body;
  try {
    const log = await Log.deleteMany({
      date_of_action: { $gte: startDate, $lte: endDate },
    });
    if (log.n == 0) return res.json({ msg: "No logs found" });
    res.json({ msg: "Deleted " + log.deletedCount + " logs" });
  } catch (error) {
    console.log("Server Error in log.deleteLog", error);
    return res.status(400).send("Server Error in log.deleteLog");
  }
};

exports.getLogs = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });
  const { startDate, endDate } = req.body;
  try {
    const styles = {
      headerDark: {
        fill: {
          fgColor: {
            rgb: '89bae4'
          },
        },
        font: {
          sz: 10,
          bold: false,
          underline:false ,
  
        },
        border:{
          top: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        bottom: {
          style: 'thin',
          color: { rgb: "000000" }
      },
      left: {
      style: 'thin',
      color: { rgb: "000000" }
    },
    right: {
      style: 'thin',
      color: { rgb: "000000" }
      }
    }
  },
  cellStyle: {
    fill: {
      fgColor: {
        rgb: 'FFFFCC'
      }
    },
    border:{
      top: {
      style: 'thin',
      color: { rgb: "000000" }
    },
    bottom: {
      style: 'thin',
      color: { rgb: "000000" }
  },
  left: {
  style: 'thin',
  color: { rgb: "000000" }
  },
  right: {
  style: 'thin',
  color: { rgb: "000000" }
  }
  },
  font: {
    sz: 10,
    bold: false,
    underline:false ,
  
  },
  },
      cellGray: {
        fill: {
          fgColor: {
            rgb: '0d4e87'
          }
        },
        font: {
          color: {
            rgb: 'FFFFFF'
          },
          sz: 10,
          bold: true,
          underline: false
        },
        border:{
          top: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        bottom: {
          style: 'thin',
          color: { rgb: "000000" }
      },
      left: {
      style: 'thin',
      color: { rgb: "000000" }
    },
    right: {
      style: 'thin',
      color: { rgb: "000000" }
  }
      }
      },
      cellFont10: {
        font: {
          sz: 10,
          bold: false,
          underline: false
        }
      }
    };

    let logReportFieldsName = [
      "Date",
      "User",
      "Action",
      "Object Type",
      "Object Name"
    ];
    let logReportFields = [
      "date_of_action",
      "username",
      "action",
      "objectType",
      "objectName"
    ];

    let logReportSpecification = {};
	_.forEach(logReportFields, function(item, index){
		logReportSpecification[item] = { // <- the key should match the actual data key
			displayName: logReportFieldsName[index], // <- Here you specify the column header
			headerStyle: styles.headerDark, // <- Header style
			cellStyle: styles.cellStyle, // <- Cell style
			width: 120, // <- width in pixels
			cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
				return (value === undefined) ? 'NA' : value;
			}
		};
	});

  let data = [];
	let sheetData = [];
	// creating the data for each user
	let reportHeading = [
		[{value: 'Log Report', style: styles.cellGray}]
	];
const log = await Log.find({date_of_action : { $gte : startDate, $lte: endDate }});
if(_.isEmpty(log))
  return res.json({msg:"No logs found"});
  _.forEach(log, function(thisLog){
		let thisRowData = {
			date_of_action : thisLog.date_of_action,
			username : thisLog.username,
			action : thisLog.action,
			objectType : thisLog.objectType,
			objectName : thisLog.objectName
		}
		thisRowData.date_of_action = moment(thisLog.date_of_action).utc().format("DD MMM YYYY HH:mm:ss");
		sheetData.push(thisRowData);
	});
	let sheet = {
		name: 'Log Report',
		heading: reportHeading,
		specification: logReportSpecification,
		data: sheetData
	}
	data.push(sheet);
	let report = excel.buildExport(data);
	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	res.setHeader("Content-Disposition", "attachment; filename=" + "LogReport.xlsx");
	res.end(report, 'binary');
    
  } catch (error) {
    console.log("Server Error in log.deleteLog", error);
    return res.status(400).send("Server Error in log.deleteLog");
  }
};
