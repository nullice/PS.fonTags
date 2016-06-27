
// 

(function() {
  var Installer, e;


  $.extensionApp = {
    COMPANY_NAME: 'nullice',
    CONTACT_INFO: 'ui@nullice.com',
    PRODUCT_NAME: 'fonTags',
    PRODUCT_ID: 'fonTags',
    PRODUCT_VERSION: '1.2',
    MIN_VERSION: 1,
    MAX_VERSION: 99,
    RELATIVE_SRC_PATH: 'com.nullice.pschen.fonTags'
  }




  Installer = (function() {
    Installer.prototype.logString = '';

    Installer.prototype.photoshopVersions = {
      10: "CS3",
      11: "CS4",
      12: "CS5",
      13: "CS6",
      14: "CC",
      15: "CC 2014",
      16: "CC 2015"
    };

    Installer.prototype.isWindows = function() {
      return $.os.match(/windows/i);
    };

    Installer.prototype.isMac = function() {
      return !this.isWindows();
    };

    function Installer(config) {
      this.config = config;
      this.configure();
      this.preflight();
      this.copyFiles();
      this.teardown();
    }

    Installer.prototype.configure = function(config) {
      var k, v, _ref;
      if (this.config == null) {
        throw Error("未定义配置");
      }
      _ref = this.config;
      for (k in _ref) {
        v = _ref[k];
        this[k] = v;
      }
      this.CURRENT_PATH = File($.fileName).path;
      this.LOG_FILE_POINTER = this.createNewLogFile();
      this.CURRENT_PS_VERSION = parseInt(app.version.split('.')[0]);
      this.CEP_FOLDER = 'CEP';
      if (this.CURRENT_PS_VERSION === 14) {
        this.CEP_FOLDER = 'CEPServiceManager4';
      }
      this.SYSTEM_PATH = "" + Folder.commonFiles + "/Adobe/" + this.CEP_FOLDER + "/extensions";
      this.LOCAL_PATH = "" + Folder.userData + "/Adobe/" + this.CEP_FOLDER + "/extensions";
      this.SYSTEM_POINTER = Folder("" + this.SYSTEM_PATH + "/" + this.PRODUCT_NAME);
      this.LOCAL_POINTER = Folder("" + this.LOCAL_PATH + "/" + this.PRODUCT_NAME);
      this.SRC_POINTER = Folder("" + this.CURRENT_PATH + "/" + this.RELATIVE_SRC_PATH);
      return this.log("Product: " + this.PRODUCT_NAME + "\nVersion: " + this.PRODUCT_VERSION + "\nPhotoshop version: " + this.photoshopVersions[this.CURRENT_PS_VERSION] + "\nOperating system: " + $.os + "\nLocale: " + $.locale + "\nInstallation source: " + this.CURRENT_PATH);
    };

    Installer.prototype.preflight = function() {
      if (this.CURRENT_PS_VERSION < this.MIN_VERSION) {
        this.error("安装失败. " + this.PRODUCT_NAME + " 需要      " + this.photoshopVersions[this.MIN_VERSION] + " 或更新的版本.    ");
      }
      if (this.CURRENT_PS_VERSION > this.MAX_VERSION) {
        this.error("安装失败. " + this.PRODUCT_NAME + " 仅支持      " + this.photoshopVersions[this.MAX_VERSION] + "版本.    ");
      }
      if (this.SYSTEM_POINTER.exists) {
        this.rm(this.SYSTEM_POINTER);
      }
      if (this.LOCAL_POINTER.exists) {
        return this.rm(this.LOCAL_POINTER);
      }
    };

    Installer.prototype.teardown = function() {
      alert("安装完成\n\n请重启应用程序以使用 " + this.PRODUCT_NAME + ".");
      return this.log("安装完成");
    };

    Installer.prototype.rm = function(obj) {
      var file, path, _i, _len, _ref;
      if (obj instanceof File || obj.getFiles().length === 0) {
        path = obj.fsName;
        if (obj.remove()) {
          return this.log("rm " + path);
        }
        this.error("失败: rm " + path + " (" + obj.error + ")");
      }
      _ref = obj.getFiles().reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        arguments.callee.call(this, file);
      }
      arguments.callee.call(this, obj);
      return true;
    };

    Installer.prototype.cp = function(src, dest) {
      var file, isFile, newDest, path, _i, _len, _ref;
      if (src instanceof File) {
        if (src.copy(dest)) {
          return this.log("cp " + src.fsName + " -> " + dest.fsName);
        }
        this.error("错误: cp " + src.fsName + " -> " + dest.fsName + " (" + src.error + ")");
      }
      if (!dest.create()) {
        this.error("创建失败： " + dest.fsName);
      }
      _ref = src.getFiles();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        isFile = file instanceof File;
        path = "" + (encodeURI(dest.fsName)) + "/" + file.name;
        newDest = isFile ? File(path) : Folder(path);
        arguments.callee.apply(this, [file, newDest]);
      }
      return true;
    };

    Installer.prototype.error = function(msg) {
      this.log(msg);
      throw Error(msg);
    };

    Installer.prototype.copyFiles = function() {
      return this.cp(this.SRC_POINTER, this.LOCAL_POINTER);
    };

    Installer.prototype.log = function(msg) {
      var file;
      file = this.LOG_FILE_POINTER;
      if (!file.open('e')) {
        throw Error("无法打开日志文件");
      }
      file.seek(0, 2);
      if (!file.writeln(msg)) {
        throw Error("无法创建日志文件");
      }
      return true;
    };

    Installer.prototype.createNewLogFile = function() {
      var file;
      file = new File("" + this.CURRENT_PATH + "/" + this.PRODUCT_NAME + ".log");
      if (!file.open('w')) {
        throw Error("无法创建日志文件");
      }
      if (this.isMac()) {
        file.lineFeed = 'unix';
      }
      file.encoding = "UTF8";
      return file;
    };

    return Installer;

  })();

  try {
    new Installer($.extensionApp);
  } catch (_error) {
    e = _error;
    alert("安装失败:\n" + e + "\n\n可以查看脚本所在文件夹中的安装日志.");
  }

}).call(this);
