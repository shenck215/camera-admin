<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名">
            <el-input v-model="form.name" placeholder="支持中文，英文，数字，以及三种类型组合" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属派出所">
            <el-select v-model="form.name1" placeholder="请选择" filterable>
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
          <el-form-item label="手机号">
            <el-input v-model="form.mobile" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="密码">
            <el-input v-model="form.pw" placeholder="请输入密码" />
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
console.log(axios)

export default {
  data() {
    return {
      saveLoading: false,
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
      form: {
        roadposition: '',
        road: '',
        status: 0
      }
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
      this.saveLoading = true
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
