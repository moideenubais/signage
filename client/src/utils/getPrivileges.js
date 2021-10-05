const privileges = [
  { key: 'view', label: 'View' },
  { key: 'user', label: 'User' },
  { key: 'group', label: 'Group' },
  { key: 'player', label: 'Player' },
  { key: 'content', label: 'Content' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'playlist', label: 'Playlist' },
  { key: 'associate', label: 'Associate' }
];
export default userPrivileges => {
  return privileges.filter(privilege => userPrivileges.includes(privilege.key));
};
