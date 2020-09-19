<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口名称">
            <el-input v-model="form.name" placeholder="请设置路口名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="已选择路口方位">
          <div v-for="(item, index) of selectedRoadArray" :key="item.name" class="selectedRoad">{{ item.name }}<i class="selectedRoadClear el-icon-circle-close" @click="removeSelectedRoad(index)" /></div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form ref="form" class="roadposition_form" :model="searchform" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口方位">
            <el-input v-model="searchform.roadname" placeholder="请输入路口方位查找" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="listLoading" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
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
    <div class="savebtn">
      <el-button type="primary" :loading="saveLoading" @click="doSubmit">设置路口完成</el-button>
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
      saveLoading: false,
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
      selectedRoadArray: [
        {
          id: 1,
          name: '上海市'
        },
        {
          id: 2,
          name: '北京'
        }
      ],
      form: {
        roadposition: '',
        road: '',
        status: 0
      },
      searchform: {},
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
    removeSelectedRoad(index) {
      console.log(index)
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
      setTimeout(() => {
        this.saveLoading = false
      }, 500)
    }
  }
}
</script>

<style scoped>
.selectedRoad {
  position: relative;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding-right: 20px;
  font-size: 14px;
  color: #606266;
  margin-right: 20px;
}
.selectedRoadClear {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 20px;
  cursor: pointer;
}
.btns_box {
  margin-bottom: 20px;
}
.table_pagination {
  margin-top: 20px;
}
.savebtn {
  margin-top: 20px;
}
</style>
