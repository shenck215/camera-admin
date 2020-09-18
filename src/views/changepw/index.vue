<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="原密码">
            <el-input v-model="form.oldPw" maxlength="30" type="password" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="form.newPw" maxlength="30" type="password" />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="form.newPw2" maxlength="30" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saveLoading" @click="onSubmit">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    return {
      saveLoading: false,
      form: {
        oldPw: '',
        newPw: '',
        newPw2: ''
      }
    }
  },
  mounted: function() {
    // console.log(this)
    // this.form.ntp = '12'
  },
  methods: {
    onSubmit() {
      const { oldPw, newPw, newPw2 } = this.form
      if (!oldPw) {
        this.$message({
          message: '原密码不能为空',
          type: 'error'
        })
        return
      }
      if (!newPw) {
        this.$message({
          message: '新密码不能为空',
          type: 'error'
        })
        return
      }
      if (newPw !== newPw2) {
        this.$message({
          message: '新密码两次输入不一致',
          type: 'error'
        })
        return
      }
      this.saveLoading = true
      axios.post('/set_pwd', {
        new_pwd: newPw,
        old_pwd: oldPw,
        user_name: localStorage.getItem('username')
      }).then((res) => {
        this.saveLoading = false
        this.$message({
          message: '修改密码成功',
          type: 'success'
        })
      }).catch((a) => {
        this.saveLoading = false
        this.$message({
          message: '修改密码失败',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped>
/* .el-form-item {
  margin-bottom: 10px;
} */
</style>
