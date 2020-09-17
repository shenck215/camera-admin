<template>
  <div class="app-container">
    <div>
      <el-checkbox v-model="autoRefresh" label="启用自动刷新" border @change="autoRefreshChange" />
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      height="calc(100vh - 200px)"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="camera_id"
        label="摄像机编号"
        width="180"
      />
      <el-table-column
        prop="illegal"
        label="违法行为"
        width="180"
      >
        <template slot-scope="scope">
          <div>{{ renderIllegal(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        label="违法地点"
      />
      <el-table-column
        prop="time"
        label="采集时间"
        width="180"
      />
      <el-table-column
        prop="filename"
        label="大场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="viewImage(scope.row, 'big')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="smallvideo"
        label="小场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.small_objects && scope.row.small_objects.length" type="text" size="medium" @click="viewImage(scope.row, 'small')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="1040px"
    >
      <div id="dialog_img_box" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import { apiDomain } from '@/utils/config'

// 定时器
let intervalTimer

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      isLookBigImg: false, // 是否查看大场景
      dialogVisible: false,
      listLoading: true,
      autoRefresh: true, // 自动刷新
      tableData: []
    }
  },
  mounted() {
    this.fetchData()
    clearInterval(intervalTimer)
    this.autoRefreshChange(true)
    // 下面是模拟数据
    // this.listLoading = false
    // this.tableData = [
    //   {
    //     'filename': 'big_20200904121759_00000077.jpg', // # 大场景或者中场景截图名，
    //     // # big或者middle表示场景  20200904121759时间字符串年2020-09-04 12：17：59 00000077第77个图
    //     'location': 'abc', // # 摄像机安装的地区位置
    //     'time': '20200904121759', // #时间，同文件名里
    //     'isred': 1, // #此图是否是红灯
    //     'redline': 10, // #红灯线在图的比例，从下算
    //     'overline': 5, // #越线线在图的比例，从下算
    //     'cameradirection': 0, // #摄像头朝向，0对脸，1对背
    //     'smallvideo': 'big_20200904121759_00000077-small.jpg', // #小场景截图名，不一定存在要根据small_objects里是否有内容判读
    //     'objects': [ // #大中场景里判别的违法对象
    //       { 'illegal': 'redline', 'name': 'motorbike', 'left': 1547, 'top': 631, 'right': 1720, 'bottom': 847 },
    //       // # 违法方式，            违法对象：摩托，自行车  在图中的坐标，左，上，右，下
    //       { 'illegal': 'redline', 'name': 'motorbike', 'left': 2006, 'top': 745, 'right': 2156, 'bottom': 940 }
    //     ],
    //     'small_objects': [
    //       { 'illegal': 'redline', 'name': 'motorbike', 'left': 1685, 'top': 588, 'right': 2060, 'bottom': 1355 }
    //     ]
    //   },
    //   {
    //     'filename': 'big_20200904121759_00000077.jpg', // # 大场景或者中场景截图名，
    //     // # big或者middle表示场景  20200904121759时间字符串年2020-09-04 12：17：59 00000077第77个图
    //     'location': 'abc', // # 摄像机安装的地区位置
    //     'time': '20200904121759', // #时间，同文件名里
    //     'isred': 1, // #此图是否是红灯
    //     'redline': 10, // #红灯线在图的比例，从下算
    //     'overline': 5, // #越线线在图的比例，从下算
    //     'cameradirection': 0, // #摄像头朝向，0对脸，1对背
    //     'smallvideo': 'big_20200904121759_00000077-small.jpg', // #小场景截图名，不一定存在要根据small_objects里是否有内容判读
    //     'objects': [ // #大中场景里判别的违法对象
    //       { 'illegal': 'redline', 'name': 'motorbike', 'left': 1547, 'top': 631, 'right': 1720, 'bottom': 847 }
    //     ],
    //     'small_objects': [
    //       { 'illegal': 'redline', 'name': 'motorbike', 'left': 1685, 'top': 588, 'right': 2060, 'bottom': 1355 }
    //     ]
    //   }
    // ]
  },
  destroyed() {
    clearInterval(intervalTimer)
  },
  methods: {
    renderIllegal(rowData) {
      const objects = (rowData.objects || [])
      const illegalType = {
        redline: '闯红灯',
        overline: '越线',
        wrongway: '逆行',
        doubleman: '一车多人',
        nohelmet: '无头盔',
        umbrella: '安装伞具'
      }
      const arrarText = []
      objects.forEach((item) => {
        arrarText.push(illegalType[item.illegal])
      })
      return arrarText.join('、')
    },
    autoRefreshChange(checked) {
      clearInterval(intervalTimer)
      if (checked) {
        intervalTimer = setInterval(() => {
          this.fetchData()
        }, 3000)
      }
    },
    viewImage(row, type) {
      if (type === 'big') {
        this.isLookBigImg = true
        const currentObjects = row.objects || []
        setTimeout(() => {
          const img = document.createElement('img')
          img.src = `${apiDomain}/static/${row.filename}`
          img.style.width = '1000px'
          img.onload = (e) => {
            currentObjects.forEach((item) => {
              const { naturalWidth, clientWidth } = e.path[0]
              const proportion = (naturalWidth / clientWidth).toFixed(2)
              const boxWidth = item.bottom - item.top
              const boxheight = item.right - item.left
              const div = document.createElement('div')
              div.setAttribute('class', 'bigImgredBox')
              div.style.position = 'absolute'
              div.style.left = (item.left / proportion).toFixed(2) + 'px'
              div.style.top = (item.top / proportion).toFixed(2) + 'px'
              div.style.width = (boxWidth / proportion).toFixed(2) + 'px'
              div.style.height = (boxheight / proportion).toFixed(2) + 'px'
              div.style.border = '2px solid #f00'
              document.querySelector('#dialog_img_box').appendChild(div)
            })
          }
          document.querySelector('#dialog_img_box').appendChild(img)
        }, 100)
      } else {
        this.isLookBigImg = false
        setTimeout(() => {
          const img = document.createElement('img')
          img.src = `${apiDomain}/static/${row.smallvideo}`
          img.style.width = '1000px'
          document.querySelector('#dialog_img_box').appendChild(img)
        }, 100)
      }
      this.dialogVisible = true
    },
    fetchData() {
      this.listLoading = false
      axios.post('/list_pic').then((res) => {
        this.listLoading = false
        this.tableData = res.data
      }).catch((a) => {
        this.listLoading = false
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
#dialog_img_box {
  position: relative;
  overflow: hidden;
}

.dialogimg {
  max-width: 1000px;
}
.pagination {
  margin-top: 20px;
}
</style>
