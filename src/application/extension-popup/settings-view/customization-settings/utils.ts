/** Maps a group of settings to a single state.
 * @returns {true | false | null}
 * - ```true``` if all settings are true,
 * - ```false``` if all settings are false,
 * - ```null``` if only a part of the settings is true
 */
export const mapGroupSettingsStateToBoolean = (
  settingsGroupStates: boolean[],
) => {
  if (settingsGroupStates.every(Boolean)) {
    return true;
  }
  if (settingsGroupStates.some(Boolean)) {
    return null;
  }
  return false;
};
