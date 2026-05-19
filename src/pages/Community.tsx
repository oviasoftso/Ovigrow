import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  User,
  TrendingUp,
  Clock,
  Users,
  Megaphone,
} from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  date: string
  likes: number
}

interface Post {
  id: string
  author: string
  authorLocation: string
  category: 'general' | 'crops' | 'livestock' | 'market' | 'tips'
  title: string
  content: string
  date: string
  likes: number
  comments: Comment[]
  liked: boolean
  tags: string[]
}

const categoryConfig = {
  general: { label: 'General', variant: 'secondary' as const },
  crops: { label: 'Crops', variant: 'success' as const },
  livestock: { label: 'Livestock', variant: 'warning' as const },
  market: { label: 'Market', variant: 'default' as const },
  tips: { label: 'Tips', variant: 'outline' as const },
}

const initialPosts: Post[] = [
  {
    id: '1',
    author: 'Tendai Moyo',
    authorLocation: 'Mashonaland East',
    category: 'crops',
    title: 'Best time to plant maize in Region II?',
    content: 'I am planning to plant SC 403 maize this season. With the rains being unpredictable, should I plant early October or wait until mid-November? Last year I lost some crop to early season drought. What has worked for others in the Marondera area?',
    date: '2025-01-15',
    likes: 24,
    liked: false,
    tags: ['maize', 'planting', 'Region II'],
    comments: [
      { id: 'c1', author: 'FarmerJohn', content: 'I plant early November in Goromonzi. Early planting with Pfumvudza has worked well for me the last 2 seasons.', date: '2025-01-15', likes: 8 },
      { id: 'c2', author: 'AgriExpert', content: 'For Region II, aim for early to mid-November. Use the Pfumvudza method with mulching to conserve moisture. SC 403 is a good choice - it has decent drought tolerance.', date: '2025-01-15', likes: 15 },
    ],
  },
  {
    id: '2',
    author: 'Grace Chikowore',
    authorLocation: 'Masvingo',
    category: 'livestock',
    title: 'Supplementary feeding for cattle in dry season',
    content: 'My cattle are losing condition as the veld is getting dry. What are the most affordable supplementary feeding options available in Masvingo? I have 15 head of cattle and cannot afford commercial feed for all of them. Any advice on crop residues or other alternatives?',
    date: '2025-01-14',
    likes: 31,
    liked: true,
    tags: ['cattle', 'feeding', 'dry season'],
    comments: [
      { id: 'c3', author: 'CattleFarmerZW', content: 'Urea-treated crop residues work well. Mix urea with maize stover and molasses. Also consider buying cotton seed cake - it is cheaper than commercial feeds.', date: '2025-01-14', likes: 12 },
    ],
  },
  {
    id: '3',
    author: 'Blessing Ndlovu',
    authorLocation: 'Matabeleland North',
    category: 'market',
    title: 'Groundnut prices looking good this season',
    content: 'Groundnut prices in Bulawayo have gone up to $850/ton. If you have stock, this might be a good time to sell. The demand from oil processors is strong. I sold 2 tons last week at a good price.',
    date: '2025-01-13',
    likes: 45,
    liked: false,
    tags: ['groundnuts', 'market', 'prices'],
    comments: [
      { id: 'c4', author: 'MarketWatch', content: 'Thanks for the heads up! I have been holding my groundnuts. Will contact the Bulawayo buyers this week.', date: '2025-01-13', likes: 5 },
      { id: 'c5', author: 'PeanutKing', content: 'Prices are also good in Harare. $880/ton at Mbare Musika for grade A. The export market is driving demand.', date: '2025-01-13', likes: 9 },
    ],
  },
  {
    id: '4',
    author: 'Dr. Agriculture',
    authorLocation: 'Harare',
    category: 'tips',
    title: '5 tips for successful Pfumvudza conservation farming',
    content: 'After years of research and working with farmers across Zimbabwe, here are my top 5 Pfumvudza tips:\n\n1. Prepare holes early (August-September) so they settle before planting\n2. Use the correct spacing: 60cm between rows, 25cm within rows for maize\n3. Apply basal fertilizer (Compound D) at planting, not before\n4. Mulch heavily - at least 5cm of crop residue cover\n5. Rotate crops: maize-legume-cereal rotation works best\n\nThese simple steps can double your yield compared to conventional farming on the same land.',
    date: '2025-01-12',
    likes: 89,
    liked: true,
    tags: ['Pfumvudza', 'conservation', 'tips'],
    comments: [
      { id: 'c6', author: 'NewFarmer2024', content: 'This is very helpful! I started Pfumvudza last season and got 1.5 tons from a small plot. Will follow these tips for the next season.', date: '2025-01-12', likes: 7 },
    ],
  },
  {
    id: '5',
    author: 'Chipo Masango',
    authorLocation: 'Midlands',
    category: 'general',
    title: 'Command Agriculture inputs distribution update',
    content: 'Has anyone in the Midlands province received their Command Agriculture inputs yet? Our ward was told inputs would arrive in September but we are still waiting. The planting window is closing. Some farmers are buying their own inputs out of frustration.',
    date: '2025-01-11',
    likes: 56,
    liked: false,
    tags: ['Command Agriculture', 'inputs', 'Midlands'],
    comments: [],
  },
]

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as Post['category'],
    tags: '',
  })
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const handleAddPost = () => {
    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      authorLocation: 'Your Farm',
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      liked: false,
      tags: newPost.tags.split(',').map((t) => t.trim()).filter(Boolean),
      comments: [],
    }
    setPosts([post, ...posts])
    setNewPost({ title: '', content: '', category: 'general', tags: '' })
    setIsAddOpen(false)
  }

  const toggleLike = (postId: string) => {
    setPosts(posts.map((p) =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return
    setPosts(posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...p.comments,
              {
                id: Date.now().toString(),
                author: 'You',
                content: text,
                date: new Date().toISOString().split('T')[0],
                likes: 0,
              },
            ],
          }
        : p
    ))
    setCommentInputs({ ...commentInputs, [postId]: '' })
  }

  const totalMembers = 1247
  const totalPosts = posts.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Connect with fellow Zimbabwean farmers
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Share knowledge, ask questions, or start a discussion</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="What is your post about?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newPost.category}
                  onValueChange={(v) => setNewPost({ ...newPost, category: v as Post['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Share your thoughts, experience, or question..."
                  rows={5}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  placeholder="e.g., maize, Pfumvudza, tips"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </div>
              <Button onClick={handleAddPost} className="w-full" disabled={!newPost.title}>
                Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">Community discussions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Contributor</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Dr. Agriculture</div>
            <p className="text-xs text-muted-foreground">89 likes this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Topic</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Pfumvudza</div>
            <p className="text-xs text-muted-foreground">Most discussed this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex rounded-md border">
          <button
            className={`px-3 py-2 text-sm ${sortBy === 'recent' ? 'bg-accent font-medium' : ''}`}
            onClick={() => setSortBy('recent')}
          >
            <Clock className="h-4 w-4 inline mr-1" />
            Recent
          </button>
          <button
            className={`px-3 py-2 text-sm border-l ${sortBy === 'popular' ? 'bg-accent font-medium' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            <TrendingUp className="h-4 w-4 inline mr-1" />
            Popular
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.authorLocation} &middot; {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={categoryConfig[post.category].variant}>
                  {categoryConfig[post.category].label}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground whitespace-pre-line">{post.content}</p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <button
                  className={`flex items-center gap-1 text-sm ${
                    post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                  }`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments.length}
                </span>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="space-y-3 pt-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-muted p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addComment(post.id)
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                >
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No posts found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
