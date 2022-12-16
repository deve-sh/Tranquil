const getProjectIdFromSocketRoom = (roomId) =>
	roomId.split("project-room-").pop();

module.exports = getProjectIdFromSocketRoom;
