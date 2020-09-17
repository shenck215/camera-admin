<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="路口方位">
            <el-input v-model="form.roadposition" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属路口">
            <el-input v-model="form.road" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button class="searchBtn" type="primary" :loading="saveLoading" @click="onSubmit">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { axios } from '@/utils/request'

export default {
  data() {
    return {
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
        },
        {
          value: 3,
          label: '维修'
        }
      ],
      saveLoading: false,
      form: {
        roadposition: '',
        road: ''
      }
    }
  },
  mounted: function() {
    // this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      // axios.post('/get_sys_stat').then((res) => {
      //   this.form.big_cam_stat = res.data.big_cam_stat
      //   this.form.middle_cam_stat = res.data.middle_cam_stat
      // }).catch((a) => {
      //   this.$message({
      //     message: '获取数据异常',
      //     type: 'error'
      //   })
      // })
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
.searchBtn {
  margin-left: 20px;
}
</style>
