<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="摄像机1">
            <el-radio-group v-model="form.big_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="摄像机2">
            <el-radio-group v-model="form.middle_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
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
    return {
      saveLoading: false,
      form: {
        big_cam_stat: '',
        middle_cam_stat: ''
      }
    }
  },
  mounted: function() {
    this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      axios.post('/get_sys_stat').then((res) => {
        this.form.big_cam_stat = res.data.big_cam_stat
        this.form.middle_cam_stat = res.data.middle_cam_stat
      }).catch((a) => {
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
      })
    },
    radioChange(aa) {
      console.log(aa)
    },
    onSubmit() {
      this.saveLoading = true
      axios.post('/enable_proc', {
        big_cam: (this.form.big_cam_stat === 'running' ? 1 : 0),
        middle_cam: (this.form.middle_cam_stat === 'running' ? 1 : 0)
      }).then((res) => {
        this.saveLoading = false
        this.$message({
          message: '设置成功',
          type: 'success'
        })
      }).catch((a) => {
        this.saveLoading = false
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
