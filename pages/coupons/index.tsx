import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import Link from 'next/link'
import { Button, Card, Col, Row, Table, Image, Spinner } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetAllCoupons, backendDeleteCoupon, backendSearchCoupons } from '../../helpers/backend_helper'
import * as XLSX from 'xlsx';
import { EDIT_DEMO_IMAGE, IMAGE_URL, RED_TRASH_IMAGE, WHITE_FILTER_IMAGE, WHITE_PLUS_CIRCLE_IMAGE, EXCEL_DEMO_IMAGE, WHITE_TRASH_IMAGE } from '../../utils/constant';
import { ModuleAccessInterface } from '../../interfaces/setting.interface';

export default function Coupons() {
  const router = useRouter()
  const [couponExport, setCouponExport] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const permissionData = useSelector((state: any) => state?.permission?.permission);
  const moduleAccess = Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
    switch (item) {
      case 'coupons.read':
        return { ...acc, canRead: true };
      case 'coupons.update':
        return { ...acc, canUpdate: true };
      case 'coupons.delete':
        return { ...acc, canDelete: true };
      case 'coupons.create':
        return { ...acc, canCreate: true };
      case 'coupons.export':
        return { ...acc, canExport: true };
      case 'coupons.import':
        return { ...acc, canImport: true };
      case 'coupons.search':
        return { ...acc, canSearch: true };
      default:
        return acc;
    }
  }, {});

  const [data, setData] = useState(null)
  const toggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }
  const couponList = useSelector((state: any) => state?.coupons?.coupons);
  const dispatch = useDispatch();
  const fetchCustomers = async () => {
    await backendGetAllCoupons().then((res) => {
      if (!res.isError) {
        setCouponExport(res.data)
      }
      dispatch({
        type: 'GET_COUPONS',
        payload: res.data
      })
      setIsLoading(false)  
    })
  }
  useEffect(() => {
    fetchCustomers()
  }, [])


  const handleDeleteItem = (id: string) => {
    backendDeleteCoupon(id).then((result) => {
      if (!result.isError) {

        fetchCustomers()
      }
      else {

      }
    }).catch((err) => {

    });
  };



  const handleOnExport = async () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(couponExport)
    XLSX.utils.book_append_sheet(wb, ws, "mysheet1");
    XLSX.writeFile(wb, "coupons.xlsx");
  }
  return (
    <Layout>
      <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '', label: '' }} itemlabel='QRcode List' />
      <Row>
        <Col xl={12} md={12}>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h3 className="card-body">QRcode List({Array.isArray(couponList) ? couponList.length : '0'})</h3>
            </Col>
            <Col md={6} className="text-end mb-3">
              {moduleAccess?.canSearch ?
                (<Link
                  href={{
                    pathname: '/coupons/search',
                  }}
                >
                  <Button className="btn btn-dark"><Search /> Get Coupon</Button>
                </Link>) : null}
              {moduleAccess?.canExport ?
                (<Button onClick={handleOnExport} className="p-2 pr-2" variant="outline-light"><Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Excel</Button>) : null}
              {moduleAccess?.canCreate ? (<Link
                href={{
                  pathname: '/coupons/create',
                }}
              >
                <Button className="btn btn-dark"><Image src={IMAGE_URL + WHITE_PLUS_CIRCLE_IMAGE} />Generate QRcode</Button>
              </Link>) : null
              }
            </Col>
            <Card className="flat-card p-0">
              <div className="row-table">
                <Col sm={12} md={12}>
                  <div className="card1">
                    <div className="table-border-style">
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Profile Name</th>
                              <th>Coupons</th>
                              <th>Date</th>
                              <th>GG NO</th>
                              <th>Customer Type</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(couponList) && couponList.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td><Link className="mb-3"
                                    href={{
                                      pathname: '/coupons/' + item._id,
                                    }}
                                  >{item.profileName}</Link></td>
                                  <td>{item.couponCount}</td>
                                  <td>{new Date(item.createdAt).toDateString()}</td>
                                  <td>{item.productNo}</td>
                                  <td>{item.customerType}</td>
                                  <td>{moduleAccess?.canUpdate ? (<Link
                                    href={{
                                      pathname: '/coupons/create',
                                      query: { id: item._id },
                                    }}><Image src={IMAGE_URL + EDIT_DEMO_IMAGE} /></Link>) : null
                                  }
                                    {moduleAccess?.canDelete ? (<Button className="btn p-0 btn-icon" onClick={() => { handleDeleteItem(item._id) }} ><Image src={IMAGE_URL + RED_TRASH_IMAGE} /></Button>) : null
                                    }
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </Col>
                {(isLoading) ? <Col xl={12} sm={12} xs={12} className='mb-3 text-center'><Spinner animation="border" /></Col> : null}
              </div>
            </Card>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}
