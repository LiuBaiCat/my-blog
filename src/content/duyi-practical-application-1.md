---
title: 前端深研(3/5)——实战-歌词滚动效果
date: 2026-06-24
updatetime: 2026-06-24
tags: [前端, 实战, 歌词滚动效果]
description: 实现一个简单的歌词滚动效果，用户可以在播放音乐时查看歌词。
pinned: true
---

[lyrics scrolling effect](/duyi_3.html)

> [!IMPORTANT]
> __声明__：<mark>此页面所涉及的歌曲资源仅用于 HTML/CSS/JavaScript 前端技术学习与练习，无意侵犯任何版权。如有侵权，请联系删除。请勿用于任何商业用途。</mark>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <meta name="description" content="本页面所涉及的歌曲资源仅用于前端技术学习与练习，无意侵犯任何版权。请勿用于任何商业用途。" />
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #000;
        color: #666;
        text-align: center;
      }
      audio {
        width: 450px;
        margin: 30px 0;
        z-index: 100;
        position: relative;
      }
      .container {
        height: 420px;
        z-index: 99;
        position: relative;
      }
      .container ul {
        transition: 0.2s;
        list-style: none;
        overflow: hidden;
      }
      .container li {
        height: 30px;
        line-height: 30px;
        transition: 0.2s;
      }
      .container li.active {
        color: #fff;
        transform: scale(1.2);
      }
    </style>
  </head>
  <body>
    <audio
      controls
      src="./assets_duyi_3/世末歌者.mp3"
      controls
    ></audio>
    <div class="container">
      <ul class="lyr-list">
        <!-- li*10>lorem3 -->
      </ul>
    </div>
    <script>
      (async () => {
        const parseTime = (timeStr) => {
          try {
            const res = /(\d+):(\d+\.\d+)/.exec(timeStr);
            return Number(res[1]) * 60 + Number(res[2]);
          } catch (err) {
            return null;
          }
        };
        const getLyric = async () => {
          try {
            const res = await fetch(
              "./assets_duyi_3/世末歌者.lrc",
            );
            const data = await res.text();
            const lines = data.split("\n");
            let lyricList = [];
            lines.forEach((line) => {
              let obj = {
                time: parseTime(line.match(/\d+:\d+\.\d+/)[0]),
                lyric: line.replace(`[${line.match(/\d+:\d+\.\d+/)[0]}]`, ""),
              };
              lyricList.push(obj);
            });
            return lyricList;
          } catch (err) {
            return [];
          }
        };
        const findIndex = () => {
          const audioTime = document.querySelector("audio").currentTime;
          const index = lyricList.findIndex((item) => item.time >= audioTime);
          return index === -1 ? lyricList.length : index;
        };
        const createLyricList = () => {
          // 创建文档碎片 -- 优化性能
          const frag = document.createDocumentFragment();
          for (let i = 0; i < lyricList.length; i++) {
            const li = document.createElement("li");
            li.innerHTML = lyricList[i].lyric;
            frag.appendChild(li);
          }
          document.querySelector(".lyr-list").appendChild(frag);
        };
        const setOffset = () => {
          const index = findIndex();
          let liHeight = document.querySelector(".lyr-list li").clientHeight;
          let container = document.querySelector(".container");
          let offset =
            liHeight * index + liHeight / 2 - container.clientHeight / 2;
          if (offset < 0) offset = 0;
          //   if (offset > container.clientHeight - liHeight)
          //     offset = container.clientHeight - liHeight;
          document.querySelector(".lyr-list").style.transform =
            `translateY(${-offset}px)`;
          document
            ?.querySelector(".lyr-list li.active")
            ?.classList.remove("active");
          document
            ?.querySelector(`.lyr-list li:nth-child(${index})`)
            ?.classList.add("active");
        };
        // 数据逻辑
        const lyricList = await getLyric();
        // 界面逻辑
        createLyricList();
        // 事件
        document
          .querySelector("audio")
          .addEventListener("timeupdate", setOffset);
      })();
    </script>
  </body>
</html>

```