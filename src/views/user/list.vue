<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="用户名">
            <el-input v-model="form.roadname" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="所属派出所">
            <el-input v-model="form.roadposition" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号">
            <el-input v-model="form.road" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
        <el-col :span="4">
          <el-button type="primary" :loading="listLoading" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btns_box">
      <el-button @click="handleClickAdd">新建</el-button>
      <el-button @click="handleClickUpdate">修改</el-button>
      <el-button @click="handleClick('start')">启动</el-button>
      <el-button @click="handleClick('stop')">禁用</el-button>
      <el-button @click="handleClick('service')">删除</el-button>
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
        prop="username"
        label="用户名"
        width="300"
      />
      <el-table-column
        prop="所属派出所"
        label="psid"
        width="150"
      />
      <el-table-column
        prop="telephone"
        label="手机号"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '禁用' : '启用' }}
        </template>
      </el-table-column>
    </el-table>
    <div class="table_pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="paginationTotal"
        :page-size="10"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from '@/utils/request'
import Router from '../../router/index'

export default {
  data() {
    return {
      listLoading: false,
      paginationTotal: 0,
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 2,
          label: '启用'
        },
        {
          value: 1,
          label: '禁用'
        }
      ],
      multipleSelection: [], // 选择的行
      tableData: [],
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
      this.listLoading = true
      axios.post('/api/users/search', {
        pageNo: pageNumber,
        pageSize: 10,
        type: 2,
        ...this.searchData
      }).then((res) => {
        this.listLoading = false
        this.tableData = res.data.data
        this.paginationTotal = res.data.totalCount
      }).catch((a) => {
        this.listLoading = false
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
      })
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
    handleClickAdd() {
      Router.push('/user/add')
    },
    handleClickUpdate() {
      console.log(11)
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
