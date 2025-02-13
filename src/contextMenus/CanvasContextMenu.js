import { math } from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import { ContextMenu } from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 */
class CanvasContextMenu extends ContextMenu {
  constructor(cfg = {}) {
    super({
      context: cfg.context,
      items: [
        [
          {
            title: "隱藏全部",
            getEnabled: function (context) {
              return context.viewer.scene.numVisibleObjects > 0;
            },
            doAction: function (context) {
              context.viewer.scene.setObjectsVisible(
                context.viewer.scene.visibleObjectIds,
                false
              );
            },
          },
          {
            title: "顯示全部",
            getEnabled: function (context) {
              const scene = context.viewer.scene;
              return (
                scene.numVisibleObjects < scene.numObjects ||
                context.viewer.scene.numXRayedObjects > 0
              );
            },
            doAction: function (context) {
              const scene = context.viewer.scene;
              scene.setObjectsVisible(scene.objectIds, true);
              scene.setObjectsXRayed(scene.xrayedObjectIds, false);
            },
          },
        ],
        [
          {
            title: "符合滿版",
            doAction: function (context) {
              const viewer = context.viewer;
              const scene = viewer.scene;
              const sceneAABB = scene.getAABB(scene.visibleObjectIds);
              viewer.cameraFlight.flyTo({
                aabb: sceneAABB,
                duration: 0.5,
              });
              viewer.cameraControl.pivotPos = math.getAABB3Center(sceneAABB);
            },
          },
        ],
        [
          {
            title: "使用Ｘ光模式",
            getEnabled: function (context) {
              const scene = context.viewer.scene;
              return scene.numXRayedObjects < scene.numObjects;
            },
            doAction: function (context) {
              const scene = context.viewer.scene;
              scene.setObjectsVisible(scene.objectIds, true);
              scene.setObjectsXRayed(scene.objectIds, true);
              scene.setObjectsPickable(scene.objectIds, false);
            },
          },
          {
            title: "隱藏Ｘ光模式",
            getEnabled: function (context) {
              return context.viewer.scene.numXRayedObjects > 0;
            },
            doAction: function (context) {
              const xrayedObjectIds = context.viewer.scene.xrayedObjectIds;
              context.viewer.scene.setObjectsPickable(xrayedObjectIds, true);
              context.viewer.scene.setObjectsXRayed(xrayedObjectIds, false);
            },
          },
        ],
        [
          {
            title: "取消選取",
            getEnabled: function (context) {
              return context.viewer.scene.numSelectedObjects > 0;
            },
            doAction: function (context) {
              context.viewer.scene.setObjectsSelected(
                context.viewer.scene.selectedObjectIds,
                false
              );
            },
          },
        ],
        [
          {
            title: "回到初始視點",
            doAction: function (context) {
              context.bimViewer.resetView();
            },
          },
        ],
        [
          {
            title: "清除所有切片",
            getEnabled: function (context) {
              return context.bimViewer.getNumSections() > 0;
            },
            doAction: function (context) {
              context.bimViewer.clearSections();
            },
          },
        ],
      ],
    });
  }
}

export { CanvasContextMenu };
