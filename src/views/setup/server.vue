<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
          <el-form-item label="当前服务器IP地址为">{{ form.ip }}</el-form-item>
          <el-form-item label="当前服务器端口为">{{ form.port }}</el-form-item>
          <el-form-item label="请设置服务器IP地址" prop="newIp">
            <el-input v-model="form.newIp" maxlength="50" />
          </el-form-item>
          <el-form-item label="请设置服务器端口" prop="newPort">
            <el-input v-model="form.newPort" maxlength="50" />
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
        newIp: [{ required: true, trigger: 'blur', validator: validateInput }],
        newPort: [{ required: true, trigger: 'blur', validator: validateInput }]
      },
      saveLoading: false,
      form: {
        ip: '',
        port: '',
        newIp: '',
        newPort: ''
      }
    }
  },
  mounted: function() {
    // console.log(this)
    // this.form.ntp = '12'
    this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      axios.post('/get_ftp_ip').then((res) => {
        this.form.ip = res.data.ip
        this.form.port = res.data.port
      }).catch((a) => {
        this.$message({
          message: '获取服务器IP异常',
          type: 'error'
        })
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { newIp, newPort } = this.form
          this.saveLoading = true
          axios.post('/set_ftp_ip', {
            ip: newIp,
            port: newPort
          }).then((res) => {
            this.saveLoading = false
            this.form.ip = newIp
            this.form.port = newPort
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }).catch((a) => {
            this.saveLoading = false
            this.$message({
              message: '设置服务器IP服务异常',
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
