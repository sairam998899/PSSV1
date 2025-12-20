import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Toast } from '@capacitor/toast';

export const useCapacitor = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor environment
    setIsCapacitor(Capacitor.isNativePlatform());

    // Get device info if available
    const getDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        setDeviceInfo(info);
      } catch (error) {
        console.log('Device info not available:', error);
      }
    };

    getDeviceInfo();
  }, []);

  const showToast = async (message: string) => {
    try {
      await Toast.show({
        text: message,
        duration: 'short',
      });
    } catch (error) {
      console.log('Toast not available:', error);
      // Fallback for web
      alert(message);
    }
  };

  return {
    isCapacitor,
    deviceInfo,
    showToast,
  };
};
