import { math } from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import { ContextMenu } from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 */
class ObjectContextMenu extends ContextMenu {
  constructor(cfg = {}) {
    super({
      context: cfg.context,
      items: [
        [
          {
            title: "查看設備資訊",
            doAction: function (context) {
              context.showObjectInModal();
            },
          },
        ],
        [
          {
            title: "符合滿版",
            doAction: function (context) {
              const viewer = context.viewer;
              const scene = viewer.scene;
              const entity = context.entity;
              viewer.cameraFlight.flyTo(
                {
                  aabb: entity.aabb,
                  duration: 0.5,
                },
                () => {
                  setTimeout(function () {
                    scene.setObjectsHighlighted(
                      scene.highlightedObjectIds,
                      false
                    );
                  }, 500);
                }
              );
              viewer.cameraControl.pivotPos = math.getAABB3Center(entity.aabb);
            },
          },
          {
            title: "全部物件符合滿版",
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
          {
            title: "在左側樹狀圖中顯示",
            doAction: function (context) {
              const objectId = context.entity.id;
              context.showObjectInExplorers(objectId);
            },
          },
        ],
        [
          {
            title: "隱藏此物件",
            getEnabled: function (context) {
              return context.entity.visible;
            },
            doAction: function (context) {
              context.entity.visible = false;
            },
          },
          {
            title: "隱藏其他物件",
            doAction: function (context) {
              const viewer = context.viewer;
              const scene = viewer.scene;
              const entity = context.entity;
              const metaObject = viewer.metaScene.metaObjects[entity.id];
              if (!metaObject) {
                return;
              }
              scene.setObjectsVisible(scene.visibleObjectIds, false);
              scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
              metaObject.withMetaObjectsInSubtree(metaObject => {
                const entity = scene.objects[metaObject.id];
                if (entity) {
                  entity.visible = true;
                }
              });
            },
          },
          {
            title: "隱藏全部物件",
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
            title: "顯示全部物件",
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
              scene.setObjectsPickable(scene.xrayedObjectIds, true);
              scene.setObjectsXRayed(scene.xrayedObjectIds, false);
            },
          },
        ],
        [
          {
            title: "Ｘ光模式",
            getEnabled: function (context) {
              return !context.entity.xrayed;
            },
            doAction: function (context) {
              const entity = context.entity;
              entity.xrayed = true;
              entity.pickable = false;
            },
          },
          {
            title: "對其他物件使用Ｘ光",
            doAction: function (context) {
              const viewer = context.viewer;
              const scene = viewer.scene;
              const entity = context.entity;
              const metaObject = viewer.metaScene.metaObjects[entity.id];
              if (!metaObject) {
                return;
              }
              scene.setObjectsVisible(scene.objectIds, true);
              scene.setObjectsXRayed(scene.objectIds, true);
              scene.setObjectsPickable(scene.objectIds, false);
              scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
              metaObject.withMetaObjectsInSubtree(metaObject => {
                const entity = scene.objects[metaObject.id];
                if (entity) {
                  entity.xrayed = false;
                  entity.pickable = true;
                }
              });
            },
          },
          {
            title: "對全部物件使用Ｘ光",
            getEnabled: function (context) {
              const scene = context.viewer.scene;
              return scene.numXRayedObjects < scene.numObjects;
            },
            doAction: function (context) {
              const scene = context.viewer.scene;
              scene.setObjectsVisible(scene.objectIds, true);
              scene.setObjectsPickable(scene.objectIds, false);
              scene.setObjectsXRayed(scene.objectIds, true);
            },
          },
          {
            title: "關閉Ｘ光模式",
            getEnabled: function (context) {
              return context.viewer.scene.numXRayedObjects > 0;
            },
            doAction: function (context) {
              const scene = context.viewer.scene;
              const xrayedObjectIds = scene.xrayedObjectIds;
              scene.setObjectsPickable(xrayedObjectIds, true);
              scene.setObjectsXRayed(xrayedObjectIds, false);
            },
          },
        ],
        [
          {
            title: "選取",
            getEnabled: function (context) {
              return !context.entity.selected;
            },
            doAction: function (context) {
              context.entity.selected = true;
            },
          },
          {
            title: "回上一步選取",
            getEnabled: function (context) {
              return context.entity.selected;
            },
            doAction: function (context) {
              context.entity.selected = false;
            },
          },
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
            title: "清除切片",
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

export { ObjectContextMenu };
