# [轉檔步驟](https://github.com/xeokit/xeokit-sdk/wiki/Creating-Files-for-Offline-BIM)

- 不支援中文檔名

## 轉檔開始

1. ./IfcConvert --use-element-guids 來源.ifc 轉出.dae --exclude=entities IfcOpeningElement
2. ./COLLADA2GLTF/build/COLLADA2GLTF-bin -i 來源.dae -o 轉出.gltf
3. gltf2xkt -s 來源.gltf -o 轉出.xkt
4. xeokit-metadata 來源.ifc 轉出.json

## 放入資料開始

- 在 app/data/projects 資料夾裡創造資料夾，
- 裡面會有個 models 的資料夾，有 index.json 及自己命名的資料夾，假設為 Mucha2016_12_15
- Mucha2016_12_15 裡面放剛剛轉好的 json，改名為 metadata.json
- Mucha2016_12_15 裡面放剛剛轉好的 xkt，改名為 geometry.xkt
- Mucha2016_12_15 裡面也要放 index.json 要改資料，詳細參考其他檔案如 Mucha2016_12_15，以及[這裏](https://github.com/xeokit/xeokit-bim-viewer)
- app/data/projects/index.json 也要把這次新增的東西放上去
- 上傳之後，就可以用 網址/app/index.html?projectId=這次新增的 id 來觀看
