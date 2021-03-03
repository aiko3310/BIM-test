import { ContextMenu } from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 * @param {*} cfg Configs
 * @param {Boolean} [cfg.enableEditModels=false] Set true to show Add/Edit/Delete options in the menu.
 */
class ModelsContextMenu extends ContextMenu {
  constructor(cfg = {}) {
    const enableEditModels = !!cfg.enableEditModels;

    const items = [
      [
        {
          title: "正在載入：",
          getEnabled: function (context) {
            return !context.bimViewer.isModelLoaded(context.modelId);
          },
          doAction: function (context) {
            context.bimViewer.loadModel(context.modelId);
          },
        },
        {
          title: "正在卸載：",
          getEnabled: function (context) {
            return context.bimViewer.isModelLoaded(context.modelId);
          },
          doAction: function (context) {
            context.bimViewer.unloadModel(context.modelId);
          },
        },
      ],
    ];

    if (enableEditModels) {
      items.push([
        {
          title: "編輯",
          getEnabled: function (context) {
            return true;
          },
          doAction: function (context) {
            context.bimViewer.editModel(context.modelId);
          },
        },
        {
          title: "刪除",
          getEnabled: function (context) {
            return true;
          },
          doAction: function (context) {
            context.bimViewer.deleteModel(context.modelId);
          },
        },
      ]);
    }

    items.push([
      {
        title: "正在載入全部",
        getEnabled: function (context) {
          const bimViewer = context.bimViewer;
          const modelIds = bimViewer.getModelIds();
          const loadedModelIds = bimViewer.getLoadedModelIds();
          return loadedModelIds.length < modelIds.length;
        },
        doAction: function (context) {
          context.bimViewer.loadAllModels();
        },
      },
      {
        title: "正在移除全部",
        getEnabled: function (context) {
          const loadedModelIds = context.bimViewer.getLoadedModelIds();
          return loadedModelIds.length > 0;
        },
        doAction: function (context) {
          context.bimViewer.unloadAllModels();
        },
      },
    ]);

    items.push([
      {
        title: "清除所有切片",
        getEnabled: function (context) {
          return context.bimViewer.getNumSections() > 0;
        },
        doAction: function (context) {
          context.bimViewer.clearSections();
        },
      },
    ]);

    super({
      context: cfg.context,
      items: items,
    });
  }
}

export { ModelsContextMenu };
