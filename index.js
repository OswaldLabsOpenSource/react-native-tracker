import { AsyncStorage } from "react-native";
import DeviceInfo from "react-native-device-info";
const storeKey = "agastyaTrackerCache";

export default async (apiKey, action, event, description) => {
    let cache = {};
    try {
        // If we have cached session ID or geodata, store it
        const value = await AsyncStorage.getItem(storeKey);
        if (value !== null) {
            cache = JSON.parse(value);
        }
        // Otherwise, cache will be an empty object {}
    } catch (error) {}
    // Get device details
    const native_session = true;
    const api_level = DeviceInfo.getAPILevel() || DeviceInfo.getBuildNumber();
    const application_name = DeviceInfo.getApplicationName();
    const battery_level = await DeviceInfo.getBatteryLevel();
    const native_brand = DeviceInfo.getBrand();
    const bundle_id = DeviceInfo.getBundleId();
    const carrier = DeviceInfo.getCarrier();
    const device_country = DeviceInfo.getDeviceCountry();
    const device_id = DeviceInfo.getDeviceId();
    const device_locacle = DeviceInfo.getDeviceLocale();
    const first_install_time =  new Date(DeviceInfo.getFirstInstallTime());
    const font_scale = DeviceInfo.getFontScale();
    const total_storage = DeviceInfo.getTotalDiskCapacity();
    const free_storage = DeviceInfo.getFreeDiskStorage();
    const max_memory = DeviceInfo.getMaxMemory();
    const total_memory = DeviceInfo.getTotalMemory();
    const native_manufacturer = DeviceInfo.getManufacturer();
    const native_model = DeviceInfo.getModel();
    const app_version = DeviceInfo.getReadableVersion();
    const native_os_name = DeviceInfo.getSystemName();
    const native_os_version = DeviceInfo.getSystemVersion();
    const unique_id = DeviceInfo.getUniqueID();
    // Send to collection endpoint
    return fetch({
        method: "POST",
        url: `https://developer.oswaldlabs.com/agastya/secure-collect/${apiKey}`,
        body: JSON.stringify({
            api_key: apiKey,
            native_session,
            api_level,
            application_name,
            battery_level,
            native_brand,
            bundle_id,
            carrier,
            device_country,
            device_id,
            device_locacle,
            first_install_time,
            font_scale,
            total_storage,
            free_storage,
            max_memory,
            total_memory,
            native_manufacturer,
            native_model,
            app_version,
            native_os_name,
            native_os_version,
            unique_id,
            action,
            event,
            description,
            ...cache,
        })
    });
}