export enum tSyslogLevels {
    Emergency = 0,
    Alert = 1,
    Critical = 2,
    Error = 3,
    Warning = 4,
    Notice = 5,
    Informational = 6,
    Debug = 7
}

export enum tLogLevel {
    debug = tSyslogLevels.Debug,
    log = tSyslogLevels.Informational,
    note = tSyslogLevels.Notice,
    warn = tSyslogLevels.Warning,
    error = tSyslogLevels.Error,
    fault = tSyslogLevels.Critical
}

export type tLogTag = string