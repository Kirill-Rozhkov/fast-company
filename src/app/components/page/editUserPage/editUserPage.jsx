import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { validator } from "../../../utils/validator"
import TextField from "../../common/form/textField"
import SelectField from "../../common/form/selectField"
import RadioField from "../../common/form/radioField"
import MultiSelectField from "../../common/form/multiSelectField"
import BackHistoryButton from "../../common/backButton"
import { useProfessions } from "../../../hooks/useProfession"
import { useAuth } from "../../../hooks/useAuth"
import { Redirect } from "react-router-dom/cjs/react-router-dom.min"
import { useSelector } from "react-redux"
import {
    getQualities,
    getQualitiesLoadingStatus
} from "../../../store/qualities"
import {
    getProfessions,
    getProfessionsLoadingStatus
} from "../../../store/professions"

const EditUserPage = () => {
    const { userId } = useParams()
    const { currentUser, isLoading: userLoading, updateUser } = useAuth()
    const professions = useSelector(getProfessions())
    const professionsloading = useSelector(getProfessionsLoadingStatus())
    const qualities = useSelector(getQualities())
    const qualitiesloading = useSelector(getQualitiesLoadingStatus())

    const transformQualities = (qualitiesIds) => {
        if (qualities) {
            return qualitiesIds.map((qual) => {
                const quality = qualities.find((q) => q._id === qual)
                return {
                    label: quality.name,
                    value: quality._id
                }
            })
        } else {
            return []
        }
    }

    const [data, setData] = useState({
        name: currentUser.name,
        email: currentUser.email,
        profession: !professionsloading ? currentUser.profession : [],
        sex: currentUser.sex,
        qualities:
            currentUser && !userLoading && !qualitiesloading
                ? transformQualities(currentUser.qualities)
                : []
    })

    const [errors, setErrors] = useState({})

    const getQualiteisList = (elements) => {
        const qualitiesArray = []
        for (const elem of elements) {
            for (const quality in qualities) {
                if (elem.value === qualities[quality]._id) {
                    qualitiesArray.push(elem.value)
                }
            }
        }
        return qualitiesArray
    }

    const transformData = (data) => {
        return data.map((d) => ({ label: d.name, value: d._id }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const isValid = validate()
        if (!isValid) return
        const { qualities } = data
        updateUser({
            ...currentUser,
            ...data,
            qualities: getQualiteisList(qualities)
        })
    }

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    }
    useEffect(() => {
        validate()
    }, [data])
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }))
    }
    const validate = () => {
        const errors = validator(data, validatorConfig)
        setErrors(errors)
        return Object.keys(errors).length === 0
    }
    const isValid = Object.keys(errors).length === 0
    return (
        <>
            {currentUser._id === userId ? (
                <div className="container mt-5">
                    {!userLoading && !qualitiesloading && currentUser && (
                        <>
                            <BackHistoryButton />
                            <div className="row">
                                <div className="col-md-6 offset-md-3 shadow p-4">
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            label="Имя"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            error={errors.name}
                                        />
                                        <TextField
                                            label="Электронная почта"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                            error={errors.email}
                                        />
                                        <SelectField
                                            label="Выбери свою профессию"
                                            defaultOption="Choose..."
                                            options={transformData(professions)}
                                            name="profession"
                                            onChange={handleChange}
                                            value={data.profession}
                                            error={errors.profession}
                                        />
                                        <RadioField
                                            options={[
                                                { name: "Male", value: "male" },
                                                {
                                                    name: "Female",
                                                    value: "female"
                                                },
                                                {
                                                    name: "Other",
                                                    value: "other"
                                                }
                                            ]}
                                            value={data.sex}
                                            name="sex"
                                            onChange={handleChange}
                                            label="Выберите ваш пол"
                                        />
                                        <MultiSelectField
                                            defaultValue={data.qualities}
                                            options={transformData(qualities)}
                                            onChange={handleChange}
                                            name="qualities"
                                            label="Выберите ваши качества"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!isValid}
                                            className="btn btn-primary w-100 mx-auto"
                                        >
                                            Обновить
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <Redirect to="/" />
            )}
        </>
    )
}

export default EditUserPage
