import { createSlice } from "@reduxjs/toolkit"
import professionService from "../services/professon.service"

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsRequested: (state) => {
            state.isLoading = true
        },
        professionsReceved: (state, action) => {
            console.log(action.payload)
            state.lastFetch = Date.now()
            state.entities = action.payload
            state.isLoading = false
        },
        professionsRequestFiled: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        }
    }
})

const { reducer: professionsReducer, actions } = professionsSlice
const { professionsRequested, professionsReceved, professionsRequestFiled } =
    actions

export const loadProfessionsList = () => async (dispatch) => {
    dispatch(professionsRequested())
    try {
        const { content } = await professionService.get()
        dispatch(professionsReceved(content))
    } catch (error) {
        dispatch(professionsRequestFiled(error))
    }
}

export const getProfessions = () => (state) => state.professions.entities

export const getProfessionsLoadingStatus = () => (state) => state.isLoading

export const getProfessionById = (profId) => (state) => {
    if (state.professions.entities) {
        for (const profession of state.professions.entities) {
            if (profession._id === profId) {
                return profession
            }
        }
    }
    return {}
}

export default professionsReducer
