const PERMS = {
  USER: {
    READ: "user:read",
    READ_ALL: "user:read-all",
    CREATE: "user:create",
    UPDATE: "user:update",
    DELETE: "user:delete",
    TOGGLE_ACTIVE: "user:toggle-active",
  },
  SERVICE: {
    READ: "service:read",
    READ_ALL: "service:read-all",
    CREATE: "service:create",
    UPDATE: "service:update",
    DELETE: "service:delete",
  },
  AVAILABILITY: {
    MANAGE: "availability:manage",
    READ_ALL: "availability:read-all",
  },
  MEETING_REQUESTS: {
    READ: "meeting-requests:read",
    READ_ALL: "meeting-requests:read-all",
    READ_OWN: "meeting-requests:read-own",
    ACCEPT: "meeting-requests:accept",
    REJECT: "meeting-requests:reject",
    COMPLETE: "meeting-requests:complete",
  },
  PROJECT_MEETING: {
    READ: "project-meeting:read",
    READ_ALL: "project-meeting:read-all",
    CREATE: "project-meeting:create",
    UPDATE: "project-meeting:update",
    DELETE: "project-meeting:delete",
  },
  STATISTICS: {
    READ: "statistics:read",
  },
};

export default PERMS;
