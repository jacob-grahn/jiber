const DEBUG = 'DEBUG'
const INFO = 'INFO'
const WARNING = 'WARNING'
const ERROR = 'ERROR'

const levels = [DEBUG, INFO, WARNING, ERROR]

const logAtLevel = (level: string) => (...params: any[]) => {
  const envLevel = process.env.JIBER_LOG_LEVEL || INFO
  const envIndex = levels.indexOf(envLevel)
  const index = levels.indexOf(level)
  const log: any = console.log
  if (index >= envIndex) log(level, ...params)
}

export const logger = {
  // useful for development, not production
  debug: logAtLevel(DEBUG),

  // something that might be nice to know
  info: logAtLevel(INFO),

  // deal with it at earliest convenience
  warning: logAtLevel(WARNING),

  // emergency, wake someone up at 3:00 am
  error: logAtLevel(ERROR)
}
