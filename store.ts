import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, CartItem } from "./types";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

//import { TypedUseSelectorHook, useDispatch, useSelector } from './node_modules/react-redux/dist/react-redux.d';

const cartSlice = createSlice({
        name:"cart",
        initialState:{items:[] as CartItem[]},
        reducers:{
            addToCart (s,a:PayloadAction<Book>){
                const ex = s.items.find(i=>i.book.id===a.payload.id);
                if(ex){
                    ex.quantity+=1;
                }else{
                    const i:CartItem = {
                        book:a.payload,
                        quantity:1
                    }
                    s.items.push(i);
                }
            },
            removeCart(s,a:PayloadAction<string>){
                s.items= s.items.filter(i=>i.book.id!=a.payload)
            },
            setCart(s,a:PayloadAction<CartItem[]>){
                s.items=a.payload
            },
            setQuantity(s, a: PayloadAction<{ id: string; quantity: number }>) {
                const item = s.items.find(i => i.book.id === a.payload.id);

                if (item) {
                    item.quantity = a.payload.quantity;
                }
            }


        }
    }
)
const wishlistSlice = createSlice({
    name:"wishlist",
    initialState:{items:[] as Book[]},
    reducers:{
        setWishlist(s,a:PayloadAction<Book[]>){
            s.items=a.payload
        },
        toggle(s,a:PayloadAction<Book>){
            s.items=s.items.some(i=>i.id===a.payload.id)?s.items.filter(i=>i.id!=a.payload.id):[...s.items,a.payload]
        }

    }
})
export const store = configureStore({
    reducer:{
        cart:cartSlice.reducer,
        wishlist:wishlistSlice.reducer
    }
})
export const {addToCart,setCart,removeCart,setQuantity} = cartSlice.actions;
export const {toggle,setWishlist} = wishlistSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = ()=>useDispatch<typeof store.dispatch>()
export const useAppSelector :TypedUseSelectorHook<RootState>= useSelector;
export const isWishlist = (id:string)=>(s:RootState)=>s.wishlist.items.some(i=>i.id===id)