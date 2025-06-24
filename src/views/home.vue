<template>
  <div class="dashboard">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in dataCards" :key="index">
        <el-card :body-style="{ padding: '20px' }" class="data-card">
          <div class="card-content">
            <el-icon class="card-icon" :class="card.type"><component :is="card.icon" /></el-icon>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-trend" :class="card.trend > 0 ? 'up' : 'down'">
                {{ Math.abs(card.trend) }}%
                {{ card.trend > 0 ? '增长' : '下降' }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统访问趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="visitChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>文章分类统计</span>
            </div>
          </template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部数据展示 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新文章</span>
              <el-button text type="primary">查看更多</el-button>
            </div>
          </template>
          <div class="article-list">
            <div v-for="article in latestArticles" :key="article.id" class="article-item">
              <div class="article-title">{{ article.title }}</div>
              <div class="article-info">
                <span>{{ article.author }}</span>
                <span>{{ article.createTime }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header" style="padding: 6px 0">
              <span>最近登录记录</span>
            </div>
          </template>
          <div class="login-list">
            <div v-for="log in loginLogs" :key="log.id" class="login-item">
              <el-avatar :size="32" class="mr-2">{{
                log.username.charAt(0).toUpperCase()
              }}</el-avatar>
              <div class="login-info">
                <div class="login-user">{{ log.username }}</div>
                <div class="login-detail">
                  <span>{{ log.loginTime }}</span>
                  <span>{{ log.ip }}</span>
                  <el-tag size="small" :type="log.status === 1 ? 'success' : 'danger'">
                    {{ log.status === 1 ? '成功' : '失败' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { ref, onMounted, markRaw } from 'vue'
  import { User, View, Message, List } from '@element-plus/icons-vue'
  import * as echarts from 'echarts'
  import { getArticleList } from '@/api/article'
  import { getLoginLogs } from '@/api/login_log'

  // 顶部数据卡片数据
  const dataCards = ref([
    {
      title: '用户总数',
      value: '1,234',
      icon: markRaw(User),
      type: 'primary',
      trend: 12.5
    },
    {
      title: '今日访问',
      value: '3,456',
      icon: markRaw(View),
      type: 'success',
      trend: 8.2
    },
    {
      title: '系统消息',
      value: '55',
      icon: markRaw(Message),
      type: 'warning',
      trend: -2.1
    },
    {
      title: '待办事项',
      value: '12',
      icon: markRaw(List),
      type: 'danger',
      trend: 5.6
    }
  ])

  // 时间范围选择
  const timeRange = ref('week')

  // 访问趋势图表
  const visitChartRef = ref(null)
  let visitChart = null

  // 分类统计图表
  const categoryChartRef = ref(null)
  let categoryChart = null

  // 最新文章列表
  const latestArticles = ref([])

  // 最近登录记录
  const loginLogs = ref([])

  // 初始化访问趋势图表
  const initVisitChart = () => {
    visitChart = echarts.init(visitChartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          areaStyle: {
            opacity: 0.1
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    }
    visitChart.setOption(option)
  }

  // 初始化分类统计图表
  const initCategoryChart = () => {
    categoryChart = echarts.init(categoryChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center'
      },
      series: [
        {
          name: '文章分类',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 1048, name: '技术文章' },
            { value: 735, name: '产品更新' },
            { value: 580, name: '使用教程' },
            { value: 484, name: '最佳实践' }
          ]
        }
      ]
    }
    categoryChart.setOption(option)
  }

  // 获取最新文章
  const fetchLatestArticles = async () => {
    try {
      const { data } = await getArticleList({ page: 1, limit: 5 })
      latestArticles.value = data.data
    } catch (error) {
      console.error('获取最新文章失败:', error)
    }
  }

  // 获取登录日志
  const fetchLoginLogs = async () => {
    try {
      const { data } = await getLoginLogs({ page: 1, limit: 3 })
      loginLogs.value = data.data
    } catch (error) {
      console.error('获取登录日志失败:', error)
    }
  }

  // 监听窗口大小变化
  const handleResize = () => {
    visitChart?.resize()
    categoryChart?.resize()
  }

  onMounted(() => {
    initVisitChart()
    initCategoryChart()
    fetchLatestArticles()
    fetchLoginLogs()
    window.addEventListener('resize', handleResize)
  })
</script>

<style lang="scss" scoped>
  .dashboard {
    padding: 20px;
  }

  .mt-4 {
    margin-top: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .data-card {
    transition: all 0.3s;
  }

  .data-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .card-content {
    display: flex;
    align-items: center;
  }

  .card-icon {
    font-size: 48px;
    margin-right: 20px;
    padding: 10px;
    border-radius: 8px;
  }

  .card-icon.primary {
    background-color: rgba(64, 158, 255, 0.1);
    color: #409eff;
  }

  .card-icon.success {
    background-color: rgba(103, 194, 58, 0.1);
    color: #67c23a;
  }

  .card-icon.warning {
    background-color: rgba(230, 162, 60, 0.1);
    color: #e6a23c;
  }

  .card-icon.danger {
    background-color: rgba(245, 108, 108, 0.1);
    color: #f56c6c;
  }

  .card-info {
    flex: 1;
  }

  .card-title {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .card-trend {
    font-size: 12px;
  }

  .card-trend.up {
    color: #67c23a;
  }

  .card-trend.down {
    color: #f56c6c;
  }

  .chart-container {
    height: 300px;
  }

  .article-list {
    .article-item {
      padding: 12px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }
    }

    .article-title {
      font-size: 14px;
      margin-bottom: 8px;
      color: #303133;
    }

    .article-info {
      font-size: 12px;
      color: #909399;

      span {
        margin-right: 15px;
      }
    }
  }

  .login-list {
    .login-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }
    }

    .mr-2 {
      margin-right: 12px;
    }

    .login-info {
      flex: 1;
    }

    .login-user {
      font-size: 14px;
      color: #303133;
      margin-bottom: 8px;
    }

    .login-detail {
      font-size: 12px;
      color: #909399;

      span {
        margin-right: 15px;
      }
    }
  }
</style>
