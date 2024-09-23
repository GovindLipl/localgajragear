import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, FormLabel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import {
    backendPostAddNewCoupon, backendPatchUpdateCoupon,
    backendGetCouponInfo, backendGetCategoriesDropdownList,
    backendGetProductsDropdownList
} from '../../helpers/backend_helper'
import { WHITE_CHECKED_IMAGE, IMAGE_URL, BLACK_PLUS_CIRCLE_IMAGE, RED_TRASH_IMAGE } from '../../utils/constant';
import {
    CouponProfileInterface,
    initialCouponProfileData
} from '../../interfaces/coupon.interface';
import {
    Formik,
    FieldArray,
    useFormik,
    Field
} from 'formik';
import * as yup from "yup";
import CustomerTypeCheckbox from '../../components/InputFields/CustomerTypeCheckbox';
import SelectProductList from '../../components/InputFields/SelectProductList';
const schema = yup.object().shape({
    customerType: yup.array().required('Customertype Name is required'),
    couponInfo: yup.array().of(
        yup.object().shape({
            couponCount: yup.number()
                .required('Coupon count is required')
                .min(1, 'Coupon count must be at least 1')
                .max(10000, 'Must be at most 10000'),
            productid: yup.string().required(' products is required'),
            subcategoryid: yup.string(),
            categoryid: yup.string(),
        })
    ),
});
interface CouponInfo {
    couponCount: number;
    productid: string;
  }
export default function CouponSave() {
    const router = useRouter()
    const {
        id
    } = router.query
    const [requestData, setRequestData] = useState<CouponProfileInterface>({})
    const fetchCouponDetail = async () => {
        await backendGetCouponInfo(id).then((res) => {
            if (!res.isError) {
                formik.setValues(res.data)
            }
        })
    }
    const [categoryData, setCategoryData] = useState([])
    const [productData, setProductData] = useState([])
    const fetchCategoriesList = async () => {
        await backendGetCategoriesDropdownList().then((res: any) => {
            if (!res.isError) {
                setCategoryData(res.data)
            }
        })
    }
    const fetchProductsList = async () => {
        await backendGetProductsDropdownList().then((res: any) => {
            const {
                docs
            } = res.data
            if (!res.isError) {
                setProductData(docs)
            }
        })
    }
    useEffect(() => {
        fetchCategoriesList()
    }, [])
    useEffect(() => {
        fetchProductsList()
    }, [])
    useEffect(() => {
        if (id) {
            fetchCouponDetail()
        }
    }, [id])
    const [customerTypeData, setCustomerTypeData] = useState(['Distributor',
        'Dealer', 'Stockist', 'Mechanic', 'STU', 'Fleet Owner'
    ])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            name,
            value,
            type
        } = event.target
        formik.setFieldValue(name, (type === "number") ? parseInt(value) : value);
    }
    const handleInputChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        var customertypes = (formik.values.customerType) ? JSON.parse(JSON.stringify(formik.values.customerType)) : [];
        if (checked) {
            customertypes.push(value);
        }
        else {
            customertypes = customertypes.filter(function (item: string) {
                return item !== value
            })
        }
        formik.setFieldValue(`customerType`, customertypes);
    }
    const handleFormSubmit = async () => {
        try {
            console.log(formik.isSubmitting);
            var iData = await JSON.parse(JSON.stringify(formik.values));
            ['_id', 'active', 'createdAt', 'categoryName', 'name', 'categoryid', 'productid', 'status'].forEach(e => delete iData[e]);
            if (id) {
                await delete iData["couponCount"];
            }
            var actionSubmit = await (formik.values._id) ? backendPatchUpdateCoupon(formik.values._id, iData) : backendPostAddNewCoupon(iData)
            actionSubmit.then((result) => {
                formik.setSubmitting(false)
                if (!result.isError) {
                    router.push('/coupons');
                }
            }).catch((err) => { });
        } catch (e) {
            console.log(e, "Error in the Login");
        }
    };
    const formik = useFormik({
        initialValues: initialCouponProfileData,
        validationSchema: schema,
        onSubmit: handleFormSubmit,
      });
    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/coupons', label: 'QRcodeList' }} itemlabel='QRcode' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6}>
                            <h3 className="card-body mb-4">{(id) ? 'Edit' : 'Create'}  QRcode</h3>
                        </Col>
                        <Card className="flat-card">
                            <Row>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-center card-body'>
                                        <Col xl={6} md={6} >
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-end card-body'>
                                        <Col xl={12} md={12} className="text-end">
                                            <Button className="btn btn-dark"
                                                disabled={(formik.isValid && formik.dirty && formik.isSubmitting)}
                                                onClick={() => {
                                                    if (formik.isValid) {
                                                        formik.setSubmitting(true)
                                                        formik.handleSubmit();
                                                    }
                                                    else { console.log("is invalid", !formik.isValid) }
                                                }}
                                            >
                                                <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />
                                                Generated
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Form>
                                    {/* <Row className='p-4'>
                                        <Col md={12} sm={12} xs={12}>
                                            <CustomerTypeCheckbox key='customertype' handleInputChange={handleInputChecked} customerType={formik.values.customerType} />
                                        </Col>
                                    </Row> */}
                                    <Row className='p-4'>
                                        { Array.isArray(formik.values.couponInfo) && formik.values.couponInfo.map((info:any, index: number) => (
                                            <Row key={index}>
                                                <Col md={4} sm={4} xs={10}>
                                                    <Form.Label htmlFor="endedAt">Coupon Count </Form.Label>
                                                    <Form.Control
                                                        type='number'
                                                        name={`couponInfo[${index}].couponCount`}
                                                        value={formik.values.couponInfo[index].couponCount}
                                                        onChange={handleInputChange}
                                                        required={true} className="mb-1"
                                                        autoComplete='off'
                                                        placeholder='Enter CouponCount'
                                                    />
                                                   { (formik.values.couponInfo[index].couponCount < 1 || formik.values.couponInfo[index].couponCount > 10000 ) ? <div className="text-danger">Count must be at least 1 to 10000</div> : '' }
                                                </Col>
                                                <Col md={4} sm={4} xs={10}>
                                                <SelectProductList handleInputChange={handleInputChange} fieldname={`couponInfo[${index}].productid`} fieldvalue={formik.values.couponInfo[index].productid} />
                                                { formik.values.couponInfo[index].productid === '' && <div className="text-danger">Product Must be required</div> }
                                                </Col>
                                                <Col md={4} sm={4} xs={10}>
                                                    <button className="mt-4 btn" type="button" onClick={() => {
                                                        const newInfo = formik.values.couponInfo.filter(function (copun: any, couponind: number) { return couponind !== index });
                                                        formik.setFieldValue('couponInfo', newInfo);
                                                    }}>
                                                        <Image src={IMAGE_URL + RED_TRASH_IMAGE} />
                                                    </button>
                                                </Col>
                                            </Row>
                                        )
                                        )
                                        }
                                        <Row className='text-end'>
                                        <Col md={12} sm={12} xs={12} className='text-end'>
                                        <Button variant="link" onClick={() => {
                                                const newRole = [
                                                    ...formik.values.couponInfo,
                                                    {
                                                        couponCount: 1,
                                                        productid: ''
                                                    }
                                                ];
                                                formik.setFieldValue('couponInfo', newRole);
                                            }}
                                            ><Image src={IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE} /> </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Form>
                            </Row>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
}