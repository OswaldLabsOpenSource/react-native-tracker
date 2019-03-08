import DeviceInfo from "react-native-device-info";

const getDeviceInfo = async () => {
    const info = {};
    try { info.agastyaNative_api_level = DeviceInfo.getAPILevel() || DeviceInfo.getBuildNumber(); } catch (e) {}
    try { info.agastyaNative_application_name = DeviceInfo.getApplicationName(); } catch (e) {}
    try { info.agastyaNative_battery_level = await DeviceInfo.getBatteryLevel(); } catch (e) {}
    try { info.agastyaNative_brand = DeviceInfo.getBrand(); } catch (e) {}
    try { info.agastyaNative_bundle_id = DeviceInfo.getBundleId(); } catch (e) {}
    try { info.agastyaNative_carrier = DeviceInfo.getCarrier(); } catch (e) {}
    try { info.agastyaNative_device_country = DeviceInfo.getDeviceCountry(); } catch (e) {}
    try { info.agastyaNative_device_id = DeviceInfo.getDeviceId(); } catch (e) {}
    try { info.agastyaNative_device_locacle = DeviceInfo.getDeviceLocale(); } catch (e) {}
    try { info.agastyaNative_first_install_time =  new Date(DeviceInfo.getFirstInstallTime()); } catch (e) {}
    try { info.agastyaNative_font_scale = DeviceInfo.getFontScale(); } catch (e) {}
    try { info.agastyaNative_total_storage = DeviceInfo.getTotalDiskCapacity(); } catch (e) {}
    try { info.agastyaNative_free_storage = DeviceInfo.getFreeDiskStorage(); } catch (e) {}
    try { info.agastyaNative_max_memory = DeviceInfo.getMaxMemory(); } catch (e) {}
    try { info.agastyaNative_total_memory = DeviceInfo.getTotalMemory(); } catch (e) {}
    try { info.agastyaNative_manufacturer = DeviceInfo.getManufacturer(); } catch (e) {}
    try { info.agastyaNative_model = DeviceInfo.getModel(); } catch (e) {}
    try { info.agastyaNative_app_version = DeviceInfo.getReadableVersion(); } catch (e) {}
    try { info.agastyaNative_os_name = DeviceInfo.getSystemName(); } catch (e) {}
    try { info.agastyaNative_os_version = DeviceInfo.getSystemVersion(); } catch (e) {}
    try { info.agastyaNative_unique_id = DeviceInfo.getUniqueID(); } catch (e) {}
    return info;
};

export default class {
    constructor() {
        this.initialized = false;
    }
    init({ apiKey, url }) {
        this.initialized = true;
        this.apiKey = apiKey;
        this.url = url;
    }
    track(action, event, description) {
        if (!this.initialized) throw new Error("Initialize Agastya tracker before calling `track()`");
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.status >= 200 && req.status < 300) {
                    let success = false;
                    try {
                        success = JSON.parse(req.responseText);
                    } catch (e) {}
                    if (success.response && success.response.session_id) {
                        this.session_id = success.response.session_id;
                    }
                    return resolve(success);
                } else if (req.status) {
                    let error = false;
                    try {
                        error = JSON.parse(req.responseText);
                    } catch (e) {}
                    return reject(error);
                }
            };
            req.open("POST", `https://developer.oswaldlabs.com/agastya/secure-collect/${this.apiKey}`, true);
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            let details = {
                api_key: this.apiKey,
                url: this.url,
                session_id: this.session_id,
                action,
                event,
                description
            };
            getDeviceInfo()
                .then(info => {
                    details = { ...details, ...info };
                })
                .catch(error => console.log("error", error))
                .then(() => {
                    req.send(JSON.stringify(details));
                })
        });
    }
}
