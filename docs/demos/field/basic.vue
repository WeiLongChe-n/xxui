<template>
  <div class="demo-col">
    <vl-cell-group inset title="基础用法">
      <vl-field v-model="form.username" label="用户名" placeholder="请输入用户名" clearable />
      <vl-field v-model="form.password" label="密码" type="password" placeholder="请输入密码" />
      <vl-field
        v-model="form.desc"
        label="备注"
        type="textarea"
        placeholder="多行文本，自动增高"
        maxlength="60"
        show-word-limit
        autosize
      />
    </vl-cell-group>

    <vl-cell-group inset title="状态与图标">
      <vl-field label="禁用" model-value="不可编辑" disabled />
      <vl-field label="只读" model-value="只读内容" readonly />
      <vl-field label="错误" model-value="错误内容" error="格式不正确" />
      <vl-field label="图标" left-icon="user" placeholder="请输入手机号" right-icon="scan" />
      <vl-field label="右文字" placeholder="请输入验证码" right-text="获取验证码" @click-right-text="onSend" />
      <vl-field label="数字" type="number" placeholder="仅允许整数" />
      <vl-field label="金额" type="digit" placeholder="仅允许小数" />
    </vl-cell-group>

    <vl-cell-group inset title="对齐方式">
      <vl-field label="左对齐" placeholder="input-align=left" input-align="left" />
      <vl-field label="右对齐" placeholder="input-align=right" input-align="right" />
      <vl-field label="大号" size="large" placeholder="size=large" />
    </vl-cell-group>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Toast } from '@vela/mobile'

const form = reactive({
  username: '',
  password: '',
  desc: '',
})

const onSend = () => Toast('验证码已发送')
</script>

<style scoped>
.demo-col {
  gap: 16px;
}
</style>
