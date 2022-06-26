import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom' //in newer versions of react-dom Routes is used instead of Switch
import Signup from './user/Signup'
import Signin from './user/Signin'
import Home from './core/Home'
import PrivateRoute from './auth/PrivateRoute'
import UserDashboard from './user/UserDashboard'
import AdminRoute from './auth/AdminRoute'
import AdminDashboard from './admin/AdminDashboard'
import AddCategory from './admin/AddCategory'
import AddProduct from './user/AddProduct'
import AddSubCategory from './admin/AddSubCategory'
import UpdateCategory from './admin/UpdateCategory'
import Shop from './core/Shop'
import Product from './core/Product'
import UserProducts from './user/UserProducts'
import ViewAllProducts from './admin/ViewAllProducts'
import ViewAllUsers from './admin/ViewAllUsers'
import UpdateProfile from './user/UpdateProfile'
import ChangePassword from './user/ChangePassword'
import MyProductsView from './user/MyProductsView'
import UpdateProduct from './user/UpdateProduct'
import UserPage from './user/UserPage'
import CategoryProducts from './core/CategoryProducts'
import SubCategoryProducts from './core/SubCategoryProducts'
import Wishlist from './core/Wishlist'
import ChatPage from './chat/pages/ChatPage.jsx'
import ReviewForm from './core/ReviewForm'
import ReviewEdit from './core/ReviewEdit'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/shop/search/:search' exact component={Shop} />
        <Route path='/shop/' exact component={Shop} />
        <Route path='/products/by/category/:category' exact component={CategoryProducts} />
        <Route path='/products/by/subCategory/:subCategory' exact component={SubCategoryProducts} />
        <Route path='/signin' exact component={Signin} />
        <Route path='/signup' exact component={Signup} />
        <Route path='/product/:productId' exact component={Product} />
        <Route path='/user/products/:userId' exact component={MyProductsView} />
        <Route path='/user/userpage/:userId' exact component={UserPage} />
        <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
        <AdminRoute path='/create/category' exact component={AddCategory} />
        <AdminRoute path='/update/category' exact component={UpdateCategory} />
        <AdminRoute path='/products' exact component={ViewAllProducts} />
        <AdminRoute path='/users' exact component={ViewAllUsers} />
        <AdminRoute path='/create/subCategory' exact component={AddSubCategory} />
        <PrivateRoute path='/wishlist' exact component={Wishlist} />
        <PrivateRoute path='/create/product' exact component={AddProduct} />
        <PrivateRoute path='/user/dashboard' exact component={UserDashboard} />
        <PrivateRoute path='/userProducts' exact component={UserProducts} />
        <PrivateRoute path='/profile/update' exact component={UpdateProfile} />
        <PrivateRoute path='/profile/changePassword' exact component={ChangePassword} />
        <PrivateRoute path='/product/update/:productId' exact component={UpdateProduct} />
        <PrivateRoute path='/review-form/:productId' exact component={ReviewForm} />
        <PrivateRoute path='/review-edit/:productId/:reviewId' exact component={ReviewEdit} />

        <PrivateRoute path='/chat/:sellerId' exact component={ChatPage} />
        <PrivateRoute path='/chat' exact component={ChatPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
