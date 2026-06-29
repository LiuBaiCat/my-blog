---
title: 前端深研(4/6)——实战-购物车效果
date: 2026-06-29
updatetime: 2026-06-29
tags: [前端, 实战, 购物车效果]
description: 实现一个简单的购物车效果，用户可以在购物车中添加、删除、修改商品数量。
pinned: true
---

> [!IMPORTANT]
> **声明**：<mark>此页面所涉及的购物车资源仅用于 HTML/CSS/JavaScript 前端技术学习与练习，无意侵犯任何版权。如有侵权，请联系删除。请勿用于任何商业用途。</mark>

<div style="color: red;font-weight: bold;">此页面所涉及的购物车资源仅用于 HTML/CSS/JavaScript 前端技术学习与练习，无意侵犯任何版权。如有侵权，请联系删除。请勿用于任何商业用途。</div>

[shopping cart effect](/duyi_4.html)

> index.js

```js
// 商品项
class UIGoods {
  constructor(good) {
    this.data = good;
    this.choose = 0;
  }
  // 获取总价
  getTotalPrice() {
    return this.data.price * this.choose;
  }
  // 是否选中此件商品
  isChoose() {
    return this.choose > 0;
  }
  // 选择的数量 + 1
  increase() {
    this.choose++;
  }
  // 选择的数量 - 1
  decrease() {
    if (this.choose === 0) {
      return;
    }
    this.choose--;
  }
}

// 商品列表
class GoodsList {
  constructor() {
    this.uiGoodsList = goods.map((good) => new UIGoods(good));
    // 配送费
    this.deliveryPrice = 5;
    // 配送门槛
    this.deliveryThreshold = 30;
  }
  // 获取总价
  getTotalPrice() {
    return this.uiGoodsList.reduce((pre, cur) => pre + cur.getTotalPrice(), 0);
  }
  // 增加某件商品的数量 + 1
  increase(index) {
    this.uiGoodsList[index].increase();
  }
  // 减少某件商品的数量 - 1
  decrease(index) {
    this.uiGoodsList[index].decrease();
  }
  // 获取所有商品的总选择数量
  getTotalChooseNum() {
    return this.uiGoodsList.reduce((pre, cur) => pre + cur.choose, 0);
  }
  // 是否有商品在购物车
  hasGoodsInCart() {
    return this.getTotalChooseNum() > 0;
  }
  // 是否跨过配送门槛
  isCrossThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold;
  }
  // 是否选中此件商品
  isChoose(index) {
    return this.uiGoodsList[index].isChoose();
  }
}

// 整个UI
class UI {
  constructor() {
    this.goodsList = new GoodsList();
    this.doms = {
      goodsContainer: document.querySelector(".goods-list"),
      deliveryPrice: document.querySelector(".footer-car-tip"),
      footerPay: document.querySelector(".footer-pay"),
      footerPayInnerSpan: document.querySelector(".footer-pay span"),
      footerTotalPrice: document.querySelector(".footer-car-total"),
      footerCar: document.querySelector(".footer-car"),
      footerCarBadge: document.querySelector(".footer-car-badge"),
    };
    let carRect = this.doms.footerCar.getBoundingClientRect();
    let jumpTarget = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5,
    };
    this.jumpTarget = jumpTarget;
    this.createHTML();
    this.updateFooter();
    this.listenEvent();
  }
  // 监听各种事件
  listenEvent() {
    this.doms.footerCarBadge.addEventListener("animationend", function () {
      this.classList.remove("animate");
    });
  }
  // 创建商品项
  createHTML() {
    // 1. 生成 html 字符串 (执行效率低，开发效率高)
    // 2. 一个一个渲染到页面 (执行效率高，开发效率低)
    // 所以我们选择 1. 生成 html 字符串
    let html = "";
    this.goodsList.uiGoodsList.forEach((good, index) => {
      html += `<div class="goods-item">
          <img src="${good.data.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${good.data.title}</h2>
            <p class="goods-desc">${good.data.desc}</p>
            <p class="goods-sell">
              <span>月售 ${good.data.sellNumber}</span>
              <span>好评率${good.data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${good.data.price.toFixed(2)}</span>
              </p>
              <div class="goods-btns">
                <i data-index="${index}" class="iconfont i-jianhao"></i>
                <span>${good.choose}</span>
                <i data-index="${index}" class="iconfont i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>`;
    });
    this.doms.goodsContainer.innerHTML = html;
  }

  increase(index) {
    this.goodsList.increase(index);
    this.updateGoodsItem(index);
    this.updateFooter();
  }
  decrease(index) {
    this.goodsList.decrease(index);
    this.updateGoodsItem(index);
    this.updateFooter();
  }
  // 更新商品项
  updateGoodsItem(index) {
    let goodsDom = this.doms.goodsContainer.children[index];
    if (this.goodsList.isChoose(index)) {
      goodsDom.classList.add("active");
    } else {
      goodsDom.classList.remove("active");
    }
    goodsDom.querySelector(".goods-btns span").textContent =
      this.goodsList.uiGoodsList[index].choose;
  }
  // 更新底部数据
  updateFooter() {
    // 得到总价
    let totalPrice = this.goodsList.getTotalPrice();
    // 更新配送费
    this.doms.deliveryPrice.textContent = `配送费￥${this.goodsList.deliveryPrice.toFixed(2)}`;
    // 更新配送门槛
    if (this.goodsList.isCrossThreshold()) {
      this.doms.footerPay.classList.add("active");
    } else {
      this.doms.footerPay.classList.remove("active");
      // 防止精度问题：将总价和配送门槛都转换为整数，再进行计算，最后再转换为小数
      this.doms.footerPayInnerSpan.textContent = `还差￥${(
        Number(
          BigInt(Math.round(this.goodsList.deliveryThreshold * 100)) -
            BigInt(Math.round(totalPrice * 100)),
        ) / 100
      ).toFixed(2)}元起送`;
    }
    // 设置总价
    this.doms.footerTotalPrice.textContent = totalPrice.toFixed(2);
    // 设置购物车样式
    if (this.goodsList.hasGoodsInCart()) {
      this.doms.footerCar.classList.add("active");
    } else {
      this.doms.footerCar.classList.remove("active");
    }
    // 设置购物车数量
    this.doms.footerCarBadge.textContent = this.goodsList.getTotalChooseNum();
  }
  // 购物车动画
  cartAnimate() {
    this.doms.footerCarBadge.classList.add("animate");
  }
  jumpAnimate(index) {
    //找到对应商品项的增加按钮
    let btnAdd = this.doms.goodsContainer.children[index].querySelector(
      ".i-jiajianzujianjiahao",
    );
    let btnRect = btnAdd.getBoundingClientRect();
    let startPos = {
      x: btnRect.left,
      y: btnRect.top,
    };
    let div = document.createElement("div");
    div.className = "add-to-car";
    let i = document.createElement("i");
    i.className = "iconfont i-jiajianzujianjiahao";
    div.style.transform = `translateX(${startPos.x}px)`;
    i.style.transform = `translateY(${startPos.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);
    //强行渲染 1. clientWidth / 2. requestAnimationFrame()

    // 1. clientWidth 可以强制渲染，但是会阻塞页面渲染，影响性能
    // div.clientWidth;
    // // 设置结束位置
    // div.style.transform = `translateX(${this.jumpTarget.x}px)`;
    // i.style.transform = `translateY(${this.jumpTarget.y}px)`;

    // 2. requestAnimationFrame 可以强制渲染，但是不会阻塞页面渲染，性能好
    requestAnimationFrame(() => {
      div.style.transform = `translateX(${this.jumpTarget.x}px)`;
      i.style.transform = `translateY(${this.jumpTarget.y}px)`;
    });
    let that = this;
    div.addEventListener(
      "transitionend",
      function () {
        div.remove();
        that.cartAnimate();
      },
      {
        once: true, // 事件仅触发一次
      },
    );
  }
}
let ui = new UI();

ui.doms.goodsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("i-jiajianzujianjiahao")) {
    ui.increase(e.target.dataset.index);
    ui.jumpAnimate(e.target.dataset.index);
  } else if (e.target.classList.contains("i-jianhao")) {
    ui.decrease(e.target.dataset.index);
    ui.jumpAnimate(e.target.dataset.index);
  }
});
```
