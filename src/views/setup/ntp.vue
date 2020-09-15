<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="180px" :rules="formRules">
          <el-form-item label="当前NTP服务器地址为">
            <el-input v-model="form.ntp" disabled />
          </el-form-item>
          <el-form-item label="获取时间为">
            <el-input v-model="form.time" disabled />
          </el-form-item>
          <el-form-item label="请设置NTP服务器地址" prop="newntp">
            <el-input v-model="form.newntp" maxlength="50" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saveLoading" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import axios from 'axios'
// import { apiDomain } from '@/utils/config'
// // 所有请求头加上token
// import { getToken } from '@/utils/auth'
// axios.defaults.headers.common['token'] = (getToken() || '')
// // 设置 baseURL
// axios.defaults.baseURL = apiDomain

import { axios } from '@/utils/request'

export default {
  data() {
    const validateInput = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入必填项'))
      } else {
        callback()
      }
    }
    return {
      formRules: {
        newntp: [{ required: true, trigger: 'blur', validator: validateInput }]
      },
      saveLoading: false,
      form: {
        ntp: '',
        time: '',
        newntp: ''
      }
    }
  },
  mounted: function() {
    this.getNtp()
  },
  methods: {
    getNtp() {
      axios.post('/get_ntp').then((res) => {
        this.form.ntp = res.data.server
        this.form.time = res.data.time
      }).catch((a) => {
        this.$message({
          message: '获取NTP服务异常',
          type: 'error'
        })
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          axios.post('/set_ntp', {
            enable: 1,
            server: this.form.newntp
          }).then((res) => {
            this.saveLoading = false
            this.form.ntp = this.form.newntp
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }).catch((a) => {
            this.saveLoading = false
            this.$message({
              message: '设置NTP服务异常',
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  /* margin-bottom: 10px; */
}
</style>
