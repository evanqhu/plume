---
title: Chrome 调试
createTime: 2024/12/21 21:14:08
permalink: /engineering/m755xcdf/
---

::: note
[https://blog.wangshuai.app/2023-01-20-远程无线调试安卓手机(mi9)的 chrome 浏览器](<https://blog.wangshuai.app/2023-01-20-%E8%BF%9C%E7%A8%8B%E6%97%A0%E7%BA%BF%E8%B0%83%E8%AF%95%E5%AE%89%E5%8D%93%E6%89%8B%E6%9C%BA(mi9)%E7%9A%84chrome%E6%B5%8F%E8%A7%88%E5%99%A8/>)

<https://developer.android.com/tools/releases/platform-tools?hl=zh-cn>

<https://developer.chrome.com/docs/devtools/remote-debugging?hl=zh-cn>
:::

`chrome://inspect/#devices`

## 前提

- PC 和 手机在同一局域网下（连接同一个 Wi-Fi）
- 手机打开开发者模式，开启无线调试

## PC 设置

- 安装 Android SDK Platform-Tools

```sh
brew install android-platform-tools
```

## 手机设置

- 打开开发者选项，开启无线调试

## 步骤

1. 手机在 `无线调试` 中点击 `使用配对码配对设备`
2. PC 根据手机弹窗的 **IP 地址和端口** 和 **配对码** 输入命令配对 `adb pair 192.168.1.12:42213`
3. PC 输入手机的 **IP 地址和端口** 与之建立连接 `adb connect 192.168.1.12:39715`
4. PC 输入 `adb devices` 查看设备连接状态 `adb devices`
5. 在 PC Chrome 浏览器中打开 `chrome://inspect/#devices`，即可开始调试
