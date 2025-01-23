import { Microphone } from '@mozartec/capacitor-microphone';
import type { MicrophonePlugin, PermissionStatus, AudioRecording } from '@mozartec/capacitor-microphone';

export const useMicrophone = () => {
  const checkPermissions = async (): Promise<PermissionStatus> => {
    try {
      const permissions = await Microphone.checkPermissions();
      console.log('Permission status:', permissions);
      return permissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      throw error;
    }
  };

  const requestPermissions = async (): Promise<PermissionStatus> => {
    try {
      const permissions = await Microphone.requestPermissions();
      console.log('Requested permission:', permissions);
      return permissions;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      throw error;
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      await Microphone.startRecording();
      console.log('Recording started.');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  };

  const stopRecording = async (): Promise<AudioRecording> => {
    try {
      const recording = await Microphone.stopRecording();
      console.log('Recording stopped:', recording);
      return recording;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  };

  return {
    checkPermissions,
    requestPermissions,
    startRecording,
    stopRecording,
  };
};
