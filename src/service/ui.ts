/*
  Copyright (C) 2022 Suwings(https://github.com/Suwings)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  

  版权所有 (C) 2022 Suwings(https://github.com/Suwings)

  本程序为自由软件，你可以依据 GPL 的条款（第三版或者更高），再分发和/或修改它。
  该程序以具有实际用途为目的发布，但是并不包含任何担保，
  也不包含基于特定商用或健康用途的默认担保。具体细节请查看 GPL 协议。
*/
import readline from "readline";

import * as protocol from "./protocol";
import InstanceSubsystem from "./system_instance";
import { globalConfiguration } from "../entity/config";
import logger from "./log";
import StartCommand from "../entity/commands/start";
import StopCommand from "../entity/commands/stop";
import KillCommand from "../entity/commands/kill";
import SendCommand from "../entity/commands/cmd";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('[终端] 守护进程拥有基本的交互功能，请输入"help"查看更多信息');

function stdin() {
  rl.question("> ", (answer) => {
    try {
      const cmds = answer.split(" ");
      logger.info(`[Terminal] ${answer}`);
      const result = command(cmds[0], cmds[1], cmds[2], cmds[3]);
      if (result) console.log(result);
      else console.log(`Command ${answer} does not exist, type help to get help.`);
    } catch (err) {
      logger.error("[Terminal]", err);
    } finally {
      // next
      stdin();
    }
  });
}

stdin();

/**
 * Pass in relevant UI commands and output command results
 * @param {String} cmd
 * @return {String}
 */
function command(cmd: string, p1: string, p2: string, p3: string) {
  if (cmd === "instance") {
    if (p1 === "start") {
      InstanceSubsystem.getInstance(p2).exec(new StartCommand("Terminal"));
      return "Done.";
    }
    if (p1 === "stop") {
      InstanceSubsystem.getInstance(p2).exec(new StopCommand());
      return "Done.";
    }
    if (p1 === "kill") {
      InstanceSubsystem.getInstance(p2).exec(new KillCommand());
      return "Done.";
    }
    if (p1 === "send") {
      InstanceSubsystem.getInstance(p2).exec(new SendCommand(p3));
      return "Done.";
    }
    return "Parameter error";
  }

  if (cmd === "instances") {
    const objs = InstanceSubsystem.instances;
    let result = "instance name | instance UUID | status code\n";
    objs.forEach((v) => {
      result += `${v.config.nickname} ${v.instanceUuid} ${v.status()}\n`;
    });
    result += "\nStatus Explanation:\n Busy=-1;Stop=0;Stopping=1;Starting=2;Running=3;\n";
    return result;
  }

  if (cmd === "sockets") {
    const sockets = protocol.socketObjects();
    let result = "IP address   |   identifier\n";
    sockets.forEach((v) => {
      result += `${v.handshake.address} ${v.id}\n`;
    });
    result += `Total ${sockets.size} online.\n`;
    return result;
  }

  if (cmd == "key") {
    return globalConfiguration.config.key;
  }

  if (cmd == "exit") {
    try {
      logger.info("Preparing to shut down the daemon...");
      InstanceSubsystem.exit();
      // logger.info("Data saved, thanks for using, goodbye!");
      logger.info("The data is saved, thanks for using, goodbye!");
      logger.info("closed.");
      process.exit(0);
    } catch (err) {
      logger.error("Failed to end the program. Please check the file permissions and try again. If you still can't close it, please use Ctrl+C to close.", err);
    }
  }

  if (cmd == "help") {
    console.log("----------- Help document -----------");
    console.log(" instances view all instances");
    console.log(" Sockets view all linkers");
    console.log(" key view key");
    console.log(" exit to close this program (recommended method)");
    console.log(" instance start <UUID> to start the specified instance");
    console.log(" instance stop <UUID> to start the specified instance");
    console.log(" instance kill <UUID> to start the specified instance");
    console.log(" instance send <UUID> <CMD> to send a command to the instance");
    console.log("----------- Help document -----------");
    return "\n";
  }
}
