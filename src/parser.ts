const COMMAND_PARAM_RGX = /(?<type>[^GgMmTtNn\W\d])(?<value>[+-]?\d+\.?\d*|[+-]?\.\d+)/g;
const COMMAND_RGX = /(?<command>[GgMmTt]\d+\.?\d*)((?<type>[^GgMmTtNn\W\d])(?<value>[+-]?\d+\.?\d*|[+-]?\.\d+))*/g;

export interface Command {
  /** The name of the command e.g. 'G0' */
  command: string;
  /** An object containing the parsed command parameters */
  params: {
    [param: string]: number;
  };
}

function removeCommentsAndSpaces(gcode: string) {
  return gcode.replace(/;.*|\(.*\)|\s/gm, '');
}

function getParams(command: string) {
  let match;

  const params: {
    [param: string]: number;
  } = {};

  while ((match = COMMAND_PARAM_RGX.exec(command)) !== null) {
    if (match.groups) {
      const { type, value } = match.groups;
      params[type.toUpperCase()] = +value;
    }
  }

  return params;
}

function getCommands(gcode: string) {
  let match;

  const commands: Command[] = [];

  while ((match = COMMAND_RGX.exec(gcode)) !== null) {
    if (match && match.groups) {
      const commandString = match[0];

      const command = match.groups.command.toUpperCase().replace(/\s/g, '');

      const params = getParams(commandString);

      commands.push({ command, params });
    }
  }

  return commands;
}

/**
 * Parses a Gcode string, removing any comment, and returns an array of commands
 * @param gcode The Gcode string
 */
export function parseGcode(gcode: string) {
  const strippedGcode = removeCommentsAndSpaces(gcode);

  const commands = getCommands(strippedGcode);

  return commands;
}
