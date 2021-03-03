import { utils } from "@xeokit/xeokit-sdk/src/viewer/scene/utils.js";
import { math } from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import { ContextMenu } from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

const tempAABB = math.AABB3();
const tempVec3 = math.vec3();

class SectionToolContextMenu extends ContextMenu {
  constructor(cfg = {}) {
    if (!cfg.sectionPlanesPlugin) {
      throw "Missing config: sectionPlanesPlugin";
    }

    super(utils.apply({}, cfg));

    this._sectionPlanesPlugin = cfg.sectionPlanesPlugin;
    this._viewer = this._sectionPlanesPlugin.viewer;

    this._onSceneSectionPlaneCreated = this._viewer.scene.on(
      "sectionPlaneCreated",
      () => {
        this._buildMenu();
      }
    );

    this._onSceneSectionPlaneDestroyed = this._viewer.scene.on(
      "sectionPlaneDestroyed",
      () => {
        this._buildMenu();
      }
    );

    this._buildMenu();
  }

  _buildMenu() {
    const sectionPlanesPlugin = this._sectionPlanesPlugin;
    const sectionPlanes = Object.values(sectionPlanesPlugin.sectionPlanes);

    const sectionPlanesMenuItems = [];

    for (let i = 0, len = sectionPlanes.length; i < len; i++) {
      const sectionPlane = sectionPlanes[i];

      sectionPlanesMenuItems.push({
        getTitle: () => {
          return "切片 #" + (i + 1);
        },

        doHoverEnter(context) {
          sectionPlanesPlugin.hideControl();
          sectionPlanesPlugin.showControl(sectionPlane.id);
        },

        doHoverLeave(context) {
          sectionPlanesPlugin.hideControl();
        },

        items: [
          // Submenu
          [
            // Group
            {
              getTitle(context) {
                return "編輯";
              },

              doAction: (context) => {
                sectionPlanesPlugin.hideControl();
                sectionPlanesPlugin.showControl(sectionPlane.id);

                const sectionPlanePos = sectionPlane.pos;
                tempAABB.set(this._viewer.scene.aabb);
                math.getAABB3Center(tempAABB, tempVec3);
                tempAABB[0] += sectionPlanePos[0] - tempVec3[0];
                tempAABB[1] += sectionPlanePos[1] - tempVec3[1];
                tempAABB[2] += sectionPlanePos[2] - tempVec3[2];
                tempAABB[3] += sectionPlanePos[0] - tempVec3[0];
                tempAABB[4] += sectionPlanePos[1] - tempVec3[1];
                tempAABB[5] += sectionPlanePos[2] - tempVec3[2];

                this._viewer.cameraFlight.flyTo({
                  aabb: tempAABB,
                  fitFOV: 65,
                });
              },
            },
            {
              getTitle(context) {
                return "切換到切片";
              },

              doAction: (context) => {
                sectionPlane.flipDir();
              },
            },
            {
              getTitle(context) {
                return "刪除";
              },

              doAction: (context) => {
                sectionPlane.destroy();
              },
            },
          ],
        ],
      });
    }

    this.items = [
      [
        {
          title: "清除全部切片",
          getEnabled: function (context) {
            return context.bimViewer.getNumSections() > 0;
          },
          doAction: function (context) {
            context.bimViewer.clearSections();
          },
        },
        {
          title: "觀看全部切片",
          getEnabled: function (context) {
            return context.bimViewer.getNumSections() > 0;
          },
          doAction: function (context) {
            context.bimViewer.flipSections();
          },
        },
      ],

      sectionPlanesMenuItems,
    ];
  }

  destroy() {
    super.destroy();
    const scene = this._viewer.scene;
    scene.off(this._onSceneSectionPlaneCreated);
    scene.off(this._onSceneSectionPlaneDestroyed);
  }
}

export { SectionToolContextMenu };
