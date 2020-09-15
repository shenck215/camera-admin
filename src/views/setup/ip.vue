<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
          <el-form-item label="请选择分配模式">
            <el-radio-group v-model="form.radio" size="medium" @change="radioChange">
              <el-radio label="1" border>DHCP手动分配</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="当前IP地址">
            <el-input v-model="form.oldip" disabled />
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="设置新的IP地址" prop="ip">
            <el-input v-model="form.ip" maxlength="50" />
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="子网掩码长度" prop="mask">
            <el-input v-model="form.mask" maxlength="50" placeholder="24" />
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="默认网关" prop="gateway">
            <el-input v-model="form.gateway" maxlength="50" />
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
        ip: [{ required: true, trigger: 'blur', validator: validateInput }],
        mask: [{ required: true, trigger: 'blur', validator: validateInput }],
        gateway: [{ required: true, trigger: 'blur', validator: validateInput }]
      },
      saveLoading: false,
      form: {
        radio: '1',
        oldip: '',
        ip: '',
        mask: '',
        gateway: ''
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
      axios.post('/get_ip').then((res) => {
        this.form.oldip = res.data.ip
      }).catch((a) => {
        this.$message({
          message: '获取本机IP服务异常',
          type: 'error'
        })
      })
    },
    radioChange(aa) {
      // console.log(aa)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          axios.post('/set_ip', {
            dhcp: 0,
            dns: '8.8.8.8',
            gateway: this.form.gateway,
            ip: this.form.ip,
            mask: this.form.mask * 1, // 转成int类型
            port: 80
          }).then((res) => {
            this.saveLoading = false
            this.form.oldip = this.form.ip
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }).catch((a) => {
            this.saveLoading = false
            this.$message({
              message: '设置IP服务异常',
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
