<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
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
          <el-button type="primary" :loading="listLoading" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btns_box">
      <el-button @click="handleClick('start')">启用</el-button>
      <el-button @click="handleClick('stop')">禁用</el-button>
      <el-button @click="handleClick('service')">维修</el-button>
      <el-button @click="handleClick('href')">方位归置</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="date"
        label="路口方位"
        width="300"
      />
      <el-table-column
        prop="name"
        label="状态"
        width="150"
      />
      <el-table-column
        prop="address"
        label="所属路口"
      />
    </el-table>
    <div class="table_pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        :page-size="10"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from '@/utils/request'
console.log(axios)

export default {
  data() {
    return {
      listLoading: false,
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
      multipleSelection: [], // 选择的行
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      form: {
        roadposition: '',
        road: '',
        status: 0
      },
      searchData: {} // 搜索数据
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
</style>
