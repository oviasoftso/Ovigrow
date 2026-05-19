import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Play,
  FileText,
  Search,
  Clock,
  Users,
  Star,
  ChevronRight,
  Sprout,
  Bug,
  TrendingUp,
  Cloud,
  Leaf,
  GraduationCap,
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  topic: string
  duration: string
  lessons: number
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  enrolled: number
  progress: number
  instructor: string
  image: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  topic: string
  author: string
  readTime: string
  date: string
  views: number
}

interface Video {
  id: string
  title: string
  description: string
  topic: string
  duration: string
  views: number
  thumbnail: string
}

const topics = [
  { id: 'crop_management', label: 'Crop Management', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
  { id: 'soil_health', label: 'Soil Health', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
  { id: 'pest_control', label: 'Pest Control', icon: Bug, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
  { id: 'market_strategies', label: 'Market Strategies', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'climate_adaptation', label: 'Climate Adaptation', icon: Cloud, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20' },
]

const courses: Course[] = [
  {
    id: '1',
    title: 'Pfumvudza Conservation Farming Masterclass',
    description: 'Learn the complete Pfumvudza technique from hole preparation to harvest. Covers maize, beans, and sunflower in the conservation agriculture system.',
    topic: 'crop_management',
    duration: '4 hours',
    lessons: 12,
    level: 'beginner',
    rating: 4.8,
    enrolled: 2340,
    progress: 45,
    instructor: 'Dr. Tendai Chikowo',
    image: '',
  },
  {
    id: '2',
    title: 'Soil Testing and Amendment Guide for Zimbabwe',
    description: 'Understanding soil test results, correcting nutrient deficiencies, and building soil fertility using locally available amendments.',
    topic: 'soil_health',
    duration: '3 hours',
    lessons: 8,
    level: 'intermediate',
    rating: 4.6,
    enrolled: 1560,
    progress: 0,
    instructor: 'Prof. James Mafuratidze',
    image: '',
  },
  {
    id: '3',
    title: 'Integrated Pest Management for Smallholder Farmers',
    description: 'Comprehensive guide to identifying and managing pests using biological, cultural, and chemical methods suitable for Zimbabwean conditions.',
    topic: 'pest_control',
    duration: '5 hours',
    lessons: 15,
    level: 'intermediate',
    rating: 4.7,
    enrolled: 1890,
    progress: 20,
    instructor: 'Dr. Sithembile Dube',
    image: '',
  },
  {
    id: '4',
    title: 'Agricultural Marketing and Value Addition',
    description: 'Learn how to find markets, negotiate prices, add value to your produce, and build sustainable farming businesses in Zimbabwe.',
    topic: 'market_strategies',
    duration: '3.5 hours',
    lessons: 10,
    level: 'beginner',
    rating: 4.5,
    enrolled: 1200,
    progress: 0,
    instructor: 'Mr. Blessing Mukamuri',
    image: '',
  },
  {
    id: '5',
    title: 'Climate-Smart Agriculture Practices',
    description: 'Adapt your farming to changing climate patterns. Covers drought-tolerant varieties, water harvesting, and resilient farming systems.',
    topic: 'climate_adaptation',
    duration: '4.5 hours',
    lessons: 11,
    level: 'advanced',
    rating: 4.9,
    enrolled: 980,
    progress: 0,
    instructor: 'Dr. Rudo Muchena',
    image: '',
  },
  {
    id: '6',
    title: 'Tobacco Production: Seedbed to Auction Floor',
    description: 'Complete guide to Virginia Gold tobacco production covering nursery management, field management, curing, grading, and marketing.',
    topic: 'crop_management',
    duration: '6 hours',
    lessons: 18,
    level: 'advanced',
    rating: 4.4,
    enrolled: 750,
    progress: 0,
    instructor: 'Mr. John Makoni',
    image: '',
  },
]

const articles: Article[] = [
  {
    id: '1',
    title: 'When and How to Apply Top Dressing Fertilizer to Maize',
    excerpt: 'Top dressing with ammonium nitrate (AN) is critical for maize yield. Learn the optimal timing at V6 stage and proper application methods to maximize nitrogen uptake.',
    topic: 'crop_management',
    author: 'AGRITEX Extension',
    readTime: '5 min',
    date: '2025-01-14',
    views: 3420,
  },
  {
    id: '2',
    title: 'Understanding Your Soil Test Results: A Practical Guide',
    excerpt: 'Soil tests can be confusing. This guide explains what pH, N, P, K values mean and how to interpret them for Zimbabwean farming conditions.',
    topic: 'soil_health',
    author: 'Soil Fertility Institute',
    readTime: '8 min',
    date: '2025-01-12',
    views: 2180,
  },
  {
    id: '3',
    title: 'Fall Armyworm Early Warning Signs and Quick Response',
    excerpt: 'Learn to identify fall armyworm eggs and early instar larvae before significant damage occurs. Quick action can save your maize crop.',
    topic: 'pest_control',
    author: 'Plant Protection Unit',
    readTime: '4 min',
    date: '2025-01-10',
    views: 5670,
  },
  {
    id: '4',
    title: 'Getting the Best Prices at GMB and Private Buyers',
    excerpt: 'Tips for timing your grain sales, understanding grading standards, and negotiating better prices with both GMB and private grain buyers.',
    topic: 'market_strategies',
    author: 'Market Intelligence',
    readTime: '6 min',
    date: '2025-01-08',
    views: 1890,
  },
  {
    id: '5',
    title: 'Water Harvesting Techniques for Dry Regions',
    excerpt: 'Practical water harvesting methods including contour ridges, dead-level contours, and small dams suitable for Regions III, IV, and V.',
    topic: 'climate_adaptation',
    author: 'Climate Smart Agriculture',
    readTime: '7 min',
    date: '2025-01-06',
    views: 1340,
  },
  {
    id: '6',
    title: 'Maximizing Soybean Yield: From Variety Selection to Harvest',
    excerpt: 'A comprehensive guide to soybean production in Zimbabwe covering variety choice, inoculation, pest management, and optimal harvest timing.',
    topic: 'crop_management',
    author: 'Oilseed Crops Research',
    readTime: '10 min',
    date: '2025-01-04',
    views: 2890,
  },
]

const videos: Video[] = [
  {
    id: '1',
    title: 'How to Prepare Pfumvudza Holes - Step by Step',
    description: 'Visual demonstration of proper hole dimensions, spacing, and manure application for the Pfumvudza conservation agriculture system.',
    topic: 'crop_management',
    duration: '12:30',
    views: 15400,
    thumbnail: '',
  },
  {
    id: '2',
    title: 'Identifying Common Pests in Zimbabwean Crops',
    description: 'Field guide video showing how to identify fall armyworm, stem borer, aphids, and other common pests on maize, beans, and cotton.',
    topic: 'pest_control',
    duration: '18:45',
    views: 8900,
    thumbnail: '',
  },
  {
    id: '3',
    title: 'Simple Soil Testing at Home',
    description: 'Learn how to do basic soil pH testing using affordable kits available at agricultural supply shops in Zimbabwe.',
    topic: 'soil_health',
    duration: '8:20',
    views: 6700,
    thumbnail: '',
  },
  {
    id: '4',
    title: 'Drip Irrigation Setup for Small Gardens',
    description: 'How to set up a low-cost drip irrigation system using locally available materials for your vegetable garden or small plot.',
    topic: 'climate_adaptation',
    duration: '15:00',
    views: 4500,
    thumbnail: '',
  },
  {
    id: '5',
    title: 'Curing Virginia Gold Tobacco: A Farmer\'s Guide',
    description: 'Step-by-step tobacco curing process from priming to baling, with tips on temperature control and humidity management in the barn.',
    topic: 'crop_management',
    duration: '22:10',
    views: 3200,
    thumbnail: '',
  },
]

export default function LearningHub() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTopic, setActiveTopic] = useState<string>('all')

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'beginner': return 'success' as const
      case 'intermediate': return 'warning' as const
      case 'advanced': return 'destructive' as const
      default: return 'secondary' as const
    }
  }

  const getTopicConfig = (topicId: string) => {
    return topics.find((t) => t.id === topicId) || topics[0]
  }

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = activeTopic === 'all' || c.topic === activeTopic
    return matchesSearch && matchesTopic
  })

  const filteredArticles = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = activeTopic === 'all' || a.topic === activeTopic
    return matchesSearch && matchesTopic
  })

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = activeTopic === 'all' || v.topic === activeTopic
    return matchesSearch && matchesTopic
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Hub</h1>
        <p className="text-muted-foreground">
          Educational resources to improve your farming knowledge and skills
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Expert-led courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">Practical guides</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
            <p className="text-xs text-muted-foreground">Visual tutorials</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((s, c) => s + c.enrolled, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total learners</p>
          </CardContent>
        </Card>
      </div>

      {/* Topic filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeTopic === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTopic('all')}
        >
          All Topics
        </Button>
        {topics.map((topic) => {
          const Icon = topic.icon
          return (
            <Button
              key={topic.id}
              variant={activeTopic === topic.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTopic(topic.id)}
            >
              <Icon className={`h-4 w-4 mr-1 ${topic.color}`} />
              {topic.label}
            </Button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, articles, and videos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">
            <GraduationCap className="h-4 w-4 mr-1" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="articles">
            <FileText className="h-4 w-4 mr-1" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Play className="h-4 w-4 mr-1" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const topicConf = getTopicConfig(course.topic)
              const TopicIcon = topicConf.icon
              return (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`rounded-lg p-2 ${topicConf.bg}`}>
                        <TopicIcon className={`h-4 w-4 ${topicConf.color}`} />
                      </div>
                      <Badge variant={getLevelVariant(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {course.lessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrolled.toLocaleString()} enrolled
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">By {course.instructor}</p>
                    </div>

                    {course.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                    )}

                    <Button className="w-full" variant={course.progress > 0 ? 'default' : 'outline'}>
                      {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredArticles.map((article) => {
              const topicConf = getTopicConfig(article.topic)
              const TopicIcon = topicConf.icon
              return (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`rounded-lg p-2 ${topicConf.bg}`}>
                        <TopicIcon className={`h-4 w-4 ${topicConf.color}`} />
                      </div>
                      <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                    </div>
                    <CardTitle className="text-base">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.author}</span>
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => {
              const topicConf = getTopicConfig(video.topic)
              const TopicIcon = topicConf.icon
              return (
                <Card key={video.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="relative rounded-lg bg-muted h-32 flex items-center justify-center mb-3">
                      <Play className="h-10 w-10 text-muted-foreground opacity-50" />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <TopicIcon className={`h-3 w-3 ${topicConf.color}`} />
                      <span className="text-xs text-muted-foreground">{topicConf.label}</span>
                    </div>
                    <CardTitle className="text-sm">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs text-muted-foreground">
                      {video.views.toLocaleString()} views
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
