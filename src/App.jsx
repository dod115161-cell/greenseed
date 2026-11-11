/*import {supabase} from './supabaseClient'
import UserProfileManager from './components/UserProfileManager';



import {useState,useEffect} from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomerView from './pages/CustomerView'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CartDrawer from './components/CartDrawer'
import BlogManager from './components/BlogManager'
import {PRODUCTS,POSTS,USERS,SETTINGS} from './data/mockData'
function useLS(k,i){const [v,s]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))??i}catch{return i}})
useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v]);return [v,s]}
export default function App(){

  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        queryParams: { prompt: 'select_account' },
        redirectTo: window.location.origin }
    })
    if (error) console.error('Lỗi đăng nhập:', error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

const [role,setRole]=useLS('gs_role','Customer'),[products,setProducts]=useLS('gs_products4',PRODUCTS),[posts,setPosts]=useLS('gs_posts3',POSTS),[users,setUsers]=useLS('gs_users',USERS)
const [orders,setOrders]=useLS('gs_orders',[]),[cart,setCart]=useLS('gs_cart',[]),[settings,setSettings]=useLS('gs_settings',SETTINGS)
const [q,setQ]=useState(''),[tab,setTab]=useState(()=>typeof location!=='undefined'&&location.hash.includes('care=')?'care':'shop'),[view,setView]=useState('dash'),[drawer,setDrawer]=useState(false)
const c={products,setProducts,posts,setPosts,users,setUsers,orders,setOrders,cart,setCart,settings,setSettings,q,tab,setTab,setDrawer,           user, handleGoogleLogin, handleLogout}
const menu=role==='Customer'?[['shop','Cửa hàng'],['scan','Quét bệnh AI'],['geo','Bản đồ thổ nhưỡng'],['garden','Setup vườn AI'],['blog','Blog']]:[['dash','Bảng điều khiển'],['blog','Quản lý Blog']]
const onMenu=k=>role==='Customer'?setTab(k):setView(k)
return(<div className="min-h-screen flex flex-col"><Navbar settings={settings} q={q} setQ={setQ} cartCount={cart.reduce((s,i)=>s+i.qty,0)} role={role} setRole={r=>{setRole(r);setView('dash')}} menu={menu} onMenu={onMenu} goShop={()=>setTab('shop')} goCart={()=>setDrawer(true)}     user={user} onGoogleLogin={handleGoogleLogin} onLogout={handleLogout}/>
<main className="flex-1">{role==='Customer'?<CustomerView c={c}/>:view==='blog'?<BlogManager c={c}/>:role==='Seller'?<SellerDashboard c={c}/>:<AdminDashboard c={c}/>}</main>{role==='Customer'&&<CartDrawer open={drawer} onClose={()=>setDrawer(false)} cart={cart} setCart={setCart} products={products} onCheckout={()=>{setDrawer(false);setTab('cart')}}/>}<Footer settings={settings}/></div>)}

import UserProfileManager from './components/UserProfileManager';
*/
/*
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import UserProfileManager from './components/UserProfileManager'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomerView from './pages/CustomerView'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CartDrawer from './components/CartDrawer'
import BlogManager from './components/BlogManager'
import { PRODUCTS, POSTS, USERS, SETTINGS } from './data/mockData'


function useLS(k, i) {
  const [v, s] = useState(() => {
    try { return JSON.parse(localStorage.getItem(k)) ?? i } catch { return i }
  })
  useEffect(() => {
    try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
  }, [k, v])
  return [v, s]
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        queryParams: { prompt: 'select_account' },
        redirectTo: window.location.origin 
      }
    })
    if (error) console.error('Lỗi đăng nhập:', error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const [role, setRole] = useLS('gs_role', 'Customer')
  const [products, setProducts] = useLS('gs_products4', PRODUCTS)
  const [posts, setPosts] = useLS('gs_posts3', POSTS)
  const [users, setUsers] = useLS('gs_users', USERS)
  const [orders, setOrders] = useLS('gs_orders', [])
  const [cart, setCart] = useLS('gs_cart', [])
  const [settings, setSettings] = useLS('gs_settings', SETTINGS)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState(() => typeof location !== 'undefined' && location.hash.includes('care=') ? 'care' : 'shop')
  const [view, setView] = useState('dash')
  const [drawer, setDrawer] = useState(false)

  const c = { 
    products, setProducts, posts, setPosts, users, setUsers, 
    orders, setOrders, cart, setCart, settings, setSettings, 
    q, tab, setTab, setDrawer, user, handleGoogleLogin, handleLogout 
  }

  const menu = role === 'Customer' 
    ? [['shop', 'Cửa hàng'], ['scan', 'Quét bệnh AI'], ['geo', 'Bản đồ thổ nhưỡng'], ['garden', 'Setup vườn AI'], ['blog', 'Blog'], ['profile', 'Tài khoản']] 
    : [['dash', 'Bảng điều khiển'], ['blog', 'Quản lý Blog']]

  const onMenu = k => role === 'Customer' ? setTab(k) : setView(k)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        settings={settings} q={q} setQ={setQ} 
        cartCount={cart.reduce((s, i) => s + i.qty, 0)} 
        role={role} setRole={r => { setRole(r); setView('dash') }} 
        menu={menu} onMenu={onMenu} goShop={() => setTab('shop')} 
        goCart={() => setDrawer(true)} user={user} 
        onGoogleLogin={handleGoogleLogin} onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {role === 'Customer' ? (
          tab === 'profile' ? (
            <UserProfileManager supabase={supabase} session={{ user }} />
          ) : (
            <CustomerView c={c} />
          )
        ) : view === 'blog' ? (
          <BlogManager c={c} />
        ) : role === 'Seller' ? (
          <SellerDashboard c={c} />
        ) : (
          <AdminDashboard c={c} />
        )}
      </main>

      {role === 'Customer' && (
        <CartDrawer 
          open={drawer} onClose={() => setDrawer(false)} 
          cart={cart} setCart={setCart} products={products} 
          user={user}        
          supabase={supabase}
          onCheckout={() => { setDrawer(false); setTab('cart') }} 
        />
      )}
      
      <Footer settings={settings} />
    </div>
  )
}
*/
/*import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import UserProfileManager from './components/UserProfileManager'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomerView from './pages/CustomerView'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CartDrawer from './components/CartDrawer'
import BlogManager from './components/BlogManager'
import { PRODUCTS, POSTS, USERS, SETTINGS } from './data/mockData'
import AgriWiki from './components/AgriWiki'
import WeatherCalendar from './components/WeatherCalendar'
import AgriAuction from './components/AgriAuction'
import CustomGrafting from './components/CustomGrafting'

function useLS(k, i) {
  const [v, s] = useState(() => {
    try { return JSON.parse(localStorage.getItem(k)) ?? i } catch { return i }
  })
  useEffect(() => {
    try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
  }, [k, v])
  return [v, s]
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        queryParams: { prompt: 'select_account' },
        redirectTo: window.location.origin 
      }
    })
    if (error) console.error('Lỗi đăng nhập:', error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const [role, setRole] = useLS('gs_role', 'Customer')
  const [products, setProducts] = useLS('gs_products4', PRODUCTS)
  const [posts, setPosts] = useLS('gs_posts3', POSTS)
  const [users, setUsers] = useLS('gs_users', USERS)
  const [orders, setOrders] = useLS('gs_orders', [])
  const [cart, setCart] = useLS('gs_cart', [])
  const [settings, setSettings] = useLS('gs_settings', SETTINGS)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState(() => typeof location !== 'undefined' && location.hash.includes('care=') ? 'care' : 'shop')
  const [view, setView] = useState('dash')
  const [drawer, setDrawer] = useState(false)

  const c = { 
    products, setProducts, posts, setPosts, users, setUsers, 
    orders, setOrders, cart, setCart, settings, setSettings, 
    q, tab, setTab, setDrawer, user, handleGoogleLogin, handleLogout 
  }

  const menu = role === 'Customer' 
    ? [['shop', 'Cửa hàng'], ['scan', 'Quét bệnh AI'], ['calendar', '🌤️ Thời tiết & Lịch gieo'], ['auction', '🏷️ Sàn đấu giá'], ['grafting', '🧬 Ghép giống theo yêu cầu'],  ['wiki', 'Agriwiki'], ['geo', 'Bản đồ thổ nhưỡng'], ['garden', 'Setup vườn AI'], ['blog', 'Blog'], ['profile', 'Tài khoản']] 
    : [['dash', 'Bảng điều khiển'], ['blog', 'Quản lý Blog']]

  const onMenu = k => role === 'Customer' ? setTab(k) : setView(k)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        settings={settings} q={q} setQ={setQ} 
        cartCount={cart.reduce((s, i) => s + i.qty, 0)} 
        role={role} setRole={r => { setRole(r); setView('dash') }} 
        menu={menu} onMenu={onMenu} goShop={() => setTab('shop')} 
        goCart={() => setDrawer(true)} user={user} 
        onGoogleLogin={handleGoogleLogin} onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {role === 'Customer' ? (
          tab === 'profile' ? (
            // Truyền đúng session={user} kèm orders và setOrders vào UserProfileManager 
            <UserProfileManager 
              supabase={supabase} 
              session={{ user }} 
              orders={orders} 
              setOrders={setOrders} 
            />
            ) : tab === 'grafting' ? (
            <CustomGrafting 
              user={user} 
              addCart={p => setCart(cart => {
                const found = cart.find(i => i.id === p.id)
                if (found) return cart.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i)
                return [...cart, {...p, qty: 1}]
              })} 
            />
            ) : tab === 'auction' ? (
            <AgriAuction 
              user={user} 
              addCart={p => setCart(cart => {
                const found = cart.find(i => i.id === p.id)
                if (found) return cart.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i)
                return [...cart, {...p, qty: 1}]
              })} 
            />
            ) : tab === 'calendar' ? (
            <WeatherCalendar products={products} add={p => setCart(cart => {
              const found = cart.find(i => i.id === p.id)
              if (found) return cart.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i)
              return [...cart, {...p, qty: 1}]
            })} />
            ) : tab === 'wiki' ? (
            <AgriWiki 
              products={products} 
              add={p => setCart(cart => {
                const found = cart.find(i => i.id === p.id)
                if (found) return cart.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i)
                return [...cart, {...p, qty: 1}]
              })} 
            />
          ) : (
            <CustomerView c={c} />
          )
        ) : view === 'blog' ? (
          <BlogManager c={c} />
        ) : role === 'Seller' ? (
          <SellerDashboard c={c} />
        ) : (
          <AdminDashboard c={c} />
        )}
      </main>

      {role === 'Customer' && (
        <CartDrawer 
          open={drawer} onClose={() => setDrawer(false)} 
          cart={cart} setCart={setCart} products={products} 
          user={user}        
          supabase={supabase}
          onCheckout={() => { setDrawer(false); setTab('cart') }} 
        />
      )}
      
      <Footer settings={settings} />
    </div>
  )
}
  */

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import UserProfileManager from './components/UserProfileManager'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomerView from './pages/CustomerView'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CartDrawer from './components/CartDrawer'
import BlogManager from './components/BlogManager'
import { PRODUCTS, POSTS, USERS, SETTINGS } from './data/mockData'
import AgriWiki from './components/AgriWiki'
import WeatherCalendar from './components/WeatherCalendar'
import AgriAuction from './components/AgriAuction'
import CustomGrafting from './components/CustomGrafting'
import AgriMarketTrends from './components/AgriMarketTrends'
import AgriCommunityBlog from './components/AgriCommunityBlog'
import GardenCareBooking from './components/GardenCareBooking'
import SubscriptionBox from './components/SubscriptionBox'
import ServiceAdmin from './components/ServiceAdmin'
import { runRenewals } from './data/services'

function useLS(k, i) {
  const [v, s] = useState(() => {
    try { return JSON.parse(localStorage.getItem(k)) ?? i } catch { return i }
  })
  useEffect(() => {
    try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
  }, [k, v])
  return [v, s]
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        queryParams: { prompt: 'select_account' },
        redirectTo: window.location.origin + import.meta.env.BASE_URL // quay về đúng trang web (VD: /greenseed/ trên GitHub Pages)
      }
    })
    if (error) console.error('Lỗi đăng nhập:', error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const [role, setRole] = useLS('gs_role', 'Customer')
  const [products, setProducts] = useLS('gs_products4', PRODUCTS)
  const [posts, setPosts] = useLS('gs_posts3', POSTS)
  const [users, setUsers] = useLS('gs_users', USERS)
  const [orders, setOrders] = useLS('gs_orders', [])
  const [cart, setCart] = useLS('gs_cart', [])
  const [settings, setSettings] = useLS('gs_settings', SETTINGS)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState(() => typeof location !== 'undefined' && location.hash.includes('care=') ? 'care' : 'shop')
  const [view, setView] = useState('dash')
  const [drawer, setDrawer] = useState(false)
  const [bookings, setBookings] = useLS('gs_bookings', [])   // lịch hẹn dịch vụ chăm sóc vườn
  const [subs, setSubs] = useLS('gs_subs', [])               // gói vật tư định kỳ

  // Mỗi lần mở web: gói định kỳ nào đến hạn thì tự động trừ tiền + tạo đơn giao hàng
  useEffect(() => {
    const { subs: next, newOrders } = runRenewals(subs)
    if (newOrders.length) {
      setSubs(next)
      setOrders(o => [...newOrders, ...o])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Hàm thêm vào giỏ hàng đồng bộ hóa giúp CartDrawer không bao giờ bị trống
  const handleAddToCart = (p) => {
    setProducts(prevProducts => {
      const exists = prevProducts.some(item => item.id === p.id)
      if (!exists) {
        return [...prevProducts, {
          id: p.id,
          name: p.name || p.title,
          price: p.price || p.currentPrice || 0,
          emoji: p.emoji || '🌿',
          cat: 'Đặc biệt',
          stock: 99
        }]
      }
      return prevProducts
    })

    setCart(prevCart => {
      const found = prevCart.find(i => i.id === p.id)
      if (found) {
        return prevCart.map(i => i.id === p.id ? { ...i, qty: (i.qty || 1) + 1 } : i)
      }
      return [...prevCart, { 
        id: p.id, 
        name: p.name || p.title, 
        price: p.price || p.currentPrice || 0, 
        emoji: p.emoji || '🌿', 
        qty: p.qty || 1,
        stock: 99 
      }]
    })
  }

  const c = { 
    products, setProducts, posts, setPosts, users, setUsers, 
    orders, setOrders, cart, setCart, settings, setSettings, 
    q, tab, setTab, setDrawer, user, handleGoogleLogin, handleLogout 
  }

  const menu = role === 'Customer' 
    ? [['shop', 'Cửa hàng'], ['scan', 'Quét bệnh AI'], ['calendar', '🌤️ Thời tiết & Lịch gieo'], ['auction', '🏷️ Sàn đấu giá'], ['market', '📈 AI Dự báo giá'], ['grafting', '🧬 Ghép giống theo yêu cầu'],  ['wiki', 'Agriwiki'],  ['geo', 'Bản đồ thổ nhưỡng'], ['blog_community', ' Wiki & Cộng đồng'], ['garden', 'Setup vườn AI'], ['service', '🧑‍🌾 Dịch vụ chăm sóc vườn'], ['subscription', '📦 Gói vật tư định kỳ'], ['blog', 'Blog'], ['profile', 'Tài khoản']] 
    : [['dash', 'Bảng điều khiển'], ['blog', 'Quản lý Blog'], ['services', 'Dịch vụ & Gói định kỳ']]

  const onMenu = k => role === 'Customer' ? setTab(k) : setView(k)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        settings={settings} q={q} setQ={setQ} 
        cartCount={cart.reduce((s, i) => s + (i.qty || 1), 0)} 
        role={role} setRole={r => { setRole(r); setView('dash') }} 
        menu={menu} onMenu={onMenu} goShop={() => setTab('shop')} 
        goCart={() => setDrawer(true)} user={user} 
        onGoogleLogin={handleGoogleLogin} onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {role === 'Customer' ? (
          tab === 'profile' ? (
            <UserProfileManager 
              supabase={supabase} 
              session={{ user }} 
              orders={orders} 
              setOrders={setOrders} 
            />
          ) : tab === 'grafting' ? (
            <CustomGrafting user={user} addCart={handleAddToCart} />
          ) : tab === 'blog_community' ? (
          <AgriCommunityBlog user={user} addCart={handleAddToCart} />
          ) : tab === 'market' ? (
          <AgriMarketTrends user={user} addCart={handleAddToCart} />
          ) : tab === 'auction' ? (
            <AgriAuction user={user} addCart={handleAddToCart} />
          ) : tab === 'calendar' ? (
            <WeatherCalendar products={products} add={handleAddToCart} orders={orders} />
          ) : tab === 'service' ? (
            <GardenCareBooking bookings={bookings} setBookings={setBookings} orders={orders} user={user} />
          ) : tab === 'subscription' ? (
            <SubscriptionBox products={products} subs={subs} setSubs={setSubs} orders={orders} setOrders={setOrders} addCart={handleAddToCart} user={user} />
          ) : tab === 'wiki' ? (
            <AgriWiki products={products} add={handleAddToCart} />
          ) : (
            <CustomerView c={c} />
          )
        ) : view === 'services' ? (
          <ServiceAdmin bookings={bookings} setBookings={setBookings} subs={subs} setSubs={setSubs} />
        ) : view === 'blog' ? (
          <BlogManager c={c} />
        ) : role === 'Seller' ? (
          <SellerDashboard c={c} />
        ) : (
          <AdminDashboard c={c} />
        )}
      </main>

      {role === 'Customer' && (
        <CartDrawer 
          open={drawer} onClose={() => setDrawer(false)} 
          cart={cart} setCart={setCart} products={products} 
          user={user}         
          supabase={supabase}
          onCheckout={() => { setDrawer(false); setTab('cart') }} 
        />
      )}
      
      <Footer settings={settings} />
    </div>
  )
}