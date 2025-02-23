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

import { v4 } from "uuid";
import StorageSubsystem from "../common/system_storage";

function builderPassword() {
  const a = `${v4().replace(/\-/gim, "")}`;
  const b = a.slice(0, a.length / 2 - 1);
  const c = `${v4().replace(/\-/gim, "")}`;
  return b + c;
}

// @Entity
class Config {
  public version = 1;
  public ip = "";
  public port = 24444;
  public key = builderPassword();
}

// 守护进程配置类
class GlobalConfiguration {
  public config = new Config();
  private static readonly ID = "global";

  load() {
    let config: Config = StorageSubsystem.load("Config", Config, GlobalConfiguration.ID);
    if (config == null) {
      config = new Config();
      StorageSubsystem.store("Config", GlobalConfiguration.ID, config);
    }
    this.config = config;
  }

  store() {
    StorageSubsystem.store("Config", GlobalConfiguration.ID, this.config);
  }
}
const globalConfiguration = new GlobalConfiguration();
export { globalConfiguration, Config };
