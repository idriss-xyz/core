export const styles = {
  getWidgetContainer: (right: number, top: number, isFixed: boolean) =>
    `box-sizing: border-box; font-size: 12px; line-height: 1.2em; position: ${isFixed ? 'fixed' : 'absolute'}; right: ${right}px; top: ${top}px; width: 350px; background-color: #2d2d2d; z-index: 100; border-radius: 8px; font-family: sans-serif; user-select: none;`,
  getWidgetContent: () => `padding: 12px;`,
  getHeader: () =>
    `display: flex; justify-content: space-between; align-items: center;`,
  getAuthor: () => `display: block; text-decoration: none; color: #aaa;`,
  getStatusBadge: () =>
    `background-color: rgb(33, 182, 111); padding-top: 3px; padding-bottom: 3px; padding-left: 12px; padding-right: 12px; margin-right: 12px; color: #fff; border-radius: 9999px;`,
  getMainContainer: () => `margin-top: 12px;`,
  getTitle: () => `color: #fff; font-size: 14px;`,
  getDescription: () => `color: #ccc; margin-top: 4px; overflow: hidden;`,
  getFooter: () =>
    `display: flex; gap: 8px; align-items: center; margin-top: 8px;`,
  getEndsIn: () => `color: #aaa;`,
  getButton: () =>
    `display: block; background-color: #fff; color: #1c1b20; padding-top: 4px; padding-bottom: 4px; padding-left: 30px; padding-right: 30px; border-radius: 9999px; text-decoration: none;`,
  getCloseButton: () =>
    `position: absolute; width: 1.25rem; height: 1.25rem; top: 0; right: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 0; border: none; background-color: transparent; color: #aaa;`,
  getOpenButton: () =>
    `position: absolute; top: 0; right: 0; background-color: rgb(33, 182, 111); cursor: pointer; border: none; border-radius: 4px; transform: translate(50%, -50%); transition: opacity 0.2s ease;`,
};
