<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" :rules="formRules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="支持中文，英文，数字，以及三种类型组合" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属派出所">
            <el-select v-model="form.psid" placeholder="请选择" filterable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="form.telephone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="密码">
            <el-input v-model="form.password" placeholder="请输入密码" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="">
            <el-button type="primary" :loading="saveLoading" @click="doSubmit">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    const validateInput = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
      if (!value) {
        callback(new Error('请输入必填项'))
      } else if (!reg.test(value)) {
        callback(new Error('输入不合规范'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      const reg = /^1\d{10}$/
      if (!value) {
        // callback(new Error('请输入必填项'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号输入不合规范'))
      } else {
        callback()
      }
    }
    return {
      saveLoading: false,
      formRules: {
        username: [
          { required: true, trigger: 'change', validator: validateInput }
        ],
        telephone: [
          { trigger: 'change', validator: validatePhone }
        ]
      },
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '禁用'
        }
      ],
      form: {}
    }
  },
  mounted: function() {
    this.getTableData(1)
  },
  methods: {
    getTableData(pageNumber) {
      // console.log({...this.searchData})
      // axios.post('/get_sys_stat').then((res) => {
      //   this.form.big_cam_stat = res.data.big_cam_stat
      //   this.form.middle_cam_stat = res.data.middle_cam_stat
      // }).catch((a) => {
      //   this.$message({
      //     message: '获取数据异常',
      //     type: 'error'
      //   })
      // })
      this.listLoading = true
      // console.log(e)
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(pageNumber) {
      this.getTableData(pageNumber)
    },
    onSearch() {
      this.searchData = this.form
      this.getTableData(1)
    },
    handleClick(type) {
      console.log(type)
      console.log(this.multipleSelection)
    },
    doSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          axios.post('/api/user', {
            ...this.form,
            type: 2
          }).then((res) => {
            this.saveLoading = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                location.reload()
              }
            })
          }).catch((a) => {
            this.saveLoading = false
            this.$message({
              message: '操作失败',
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
.btns_box {
  margin-bottom: 20px;
}
.table_pagination {
  margin-top: 20px;
}
.savebtn {
  margin-top: 20px;
}
.el-select {
  display: block;
}
</style>
