import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Row,
  Table,
  Carousel,
  Image,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import {
  backendDeleteCoupon,
  backendGetCouponInfo,
  downloadCouponProfile,
} from "../../helpers/backend_helper";
import Link from "next/link";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import {
  EDIT_DEMO_IMAGE,
  IMAGE_URL,
  RED_TRASH_IMAGE,
  WHITE_FILTER_IMAGE,
  WHITE_PLUS_CIRCLE_IMAGE,
  EXCEL_DEMO_IMAGE,
  WHITE_TRASH_IMAGE,
} from "../../utils/constant";
import {
  CouponProfileInterface,
  initialCouponProfileData,
} from "../../interfaces/coupon.interface";
const CouponsDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [couponStatus, setCouponStatus] = useState("true");
  const [couponInfo, setCouponInfo] = useState<Array<CouponProfileInterface>>(
    []
  );
  const [couponData, setCouponData] = useState([]);
  const couponDetail = useSelector((state: any) => state?.coupons?.coupons);
  const permissionData = useSelector(
    (state: any) => state?.permission?.permission
  );
  const moduleAccess =
    Array.isArray(permissionData) &&
    permissionData.reduce((acc: any, item: any) => {
      switch (item) {
        case "coupons.delhi":
          return { ...acc, canDelhi: true };
        case "coupons.dewas":
          return { ...acc, canDewas: true };
        case "coupons.kshipra":
          return { ...acc, canKshipra: true };
        default:
          return acc;
      }
    }, {});
  const dispatch = useDispatch();
  const fetchCouponInfoDetail = async () => {
    await backendGetCouponInfo(id).then((res) => {
      if (!res.isError) {
        // const { coupons, ...couponprofile } = res.data
        setCouponInfo(res.data);
        // setCouponData(res?.data?.coupons)
      }
    });
  };
  useEffect(() => {
    if (id) fetchCouponInfoDetail();
  }, [id]);
  const handleDeleteItem = (id: string) => {
    backendDeleteCoupon(id)
      .then((result) => {
        if (!result.isError) {
        } else {
        }
      })
      .catch((err) => {});
  };

  const fetchCouponProfileDelhi = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const mappedArray = await Promise.all(
      couponInfo.map(async (info: any) => {
        return await Promise.all(
          info.coupons.map(async (coupon: any) => {
            return {
              MDES: info.subcategoryName,
              PDES: info.description,
              OEPARTNO: info.partNo,
              "Year/Month Pkd": `${month
                .toString()
                .padStart(2, "0")}/${year.toString()}`,
              MRP: info.mrp,
              GG: info.productNo,
              CPOINT: info.points,
              coupon: coupon.coupon,
              Weight: info.weight,
              "QTY /PCS": info.pcs,
              SIZE: info.size,
            };
          })
        );
      })
    );
    const flattenedArray = mappedArray.flat();
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(flattenedArray);
    XLSX.utils.book_append_sheet(wb, ws, "mysheet1");
    XLSX.writeFile(wb, "delhi.xls");
  };

  const fetchCouponProfileDewas = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const mappedArray = await Promise.all(
      couponInfo.map(async (info: any) => {
        return await Promise.all(
          info.coupons.map(async (coupon: any) => {
            return {
              MDES: info.subcategoryName,
              PDES: info.description,
              OEPARTNO: info.partNo,
              "Year/Month Pkd": `${month
                .toString()
                .padStart(2, "0")}/${year.toString()}`,
              MRP: info.mrp,
              GG: info.productNo,
              CPOINT: info.points,
              coupon: coupon.coupon,
            };
          })
        );
      })
    );
    const flattenedArray = mappedArray.flat();
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(flattenedArray);
    XLSX.utils.book_append_sheet(wb, ws, "mysheet1");
    XLSX.writeFile(wb, "dewas.xls");
  };

  const fetchCouponProfileKshipra = async () => {
    const mappedArray = await Promise.all(
      couponInfo.map(async (info: any) => {
        return await Promise.all(
          info.coupons.map(async (coupon: any) => {
            return {
              "GG NO.": info.productNo,
              //  DISCRIPTION : info.description, RATIO : info.specification,  'OE PART NO.' : info.partNo,
              // MRP: info.mrp,
              POINT: info.points,
              Coupon: coupon.coupon,
            };
          })
        );
      })
    );
    const flattenedArray = mappedArray.flat();
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(flattenedArray);
    XLSX.utils.book_append_sheet(wb, ws, "mysheet1");
    XLSX.writeFile(wb, "kshipra.xls");
  };

  return (
    <Layout>
      <BreadcrumbComponent
        firstItem={{ href: "/dashboard", label: "dashboard" }}
        secondItem={{ href: "/coupons", label: "QRcode" }}
        itemlabel="QRcode Detail"
      />
      <Row>
        <Col xl={12} sm={12} xs={12}>
          <Row>
            <Col xl={6} sm={6} xs={6}>
              <h3 className="card-body mb-4">QRcode Details</h3>
            </Col>
            <Col xl={6} sm={6} xs={6} className="text-end">
              {moduleAccess?.canDelhi && (
                <Button
                  onClick={() => {
                    fetchCouponProfileDelhi();
                  }}
                  className="p-2 pr-2 text-end"
                  variant="outline-light"
                >
                  <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Delhi
                </Button>
              )}
              {moduleAccess?.canDewas && (
                <Button
                  onClick={() => {
                    fetchCouponProfileDewas();
                  }}
                  className="p-2 pr-2 text-end"
                  variant="outline-light"
                >
                  <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Dewas
                </Button>
              )}
              {moduleAccess?.canKshipra && (
                <Button
                  onClick={() => {
                    fetchCouponProfileKshipra();
                  }}
                  className="p-2 pr-2 text-end"
                  variant="outline-light"
                >
                  <Image src={IMAGE_URL + EXCEL_DEMO_IMAGE} /> Export Kshipra
                </Button>
              )}
            </Col>
          </Row>
        </Col>
        <Card>
          <Card.Body>
            <Row className="border-top border-top-dashed">
              <Col xl={12} sm={12} xs={12}>
                <Row className="align-items-start card-body">
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">ProfileName</p>
                      <span className="text-muted ">
                        {Array.isArray(couponInfo) &&
                          couponInfo.length &&
                          couponInfo[0].profileName}
                      </span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">CustomerType</p>
                      <span className="text-muted ">
                        {Array.isArray(couponInfo) &&
                          couponInfo.length &&
                          couponInfo[0].customerType}
                      </span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">StartDate</p>
                      <span className="text-muted ">
                        {Array.isArray(couponInfo) &&
                        couponInfo.length &&
                        couponInfo[0].startDate
                          ? new Date(
                              couponInfo[0].startDate
                            ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </Col>
                  <Col xl={3} sm={4} xs={6}>
                    <div className="mb-2">
                      <p className="mb-0 f-12">EndDate</p>
                      <span className="text-muted ">
                        {Array.isArray(couponInfo) &&
                        couponInfo.length &&
                        couponInfo[0].expiryDate
                          ? new Date(
                              couponInfo[0].expiryDate
                            ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="border-top border-top-dashed">
              <Col xl={12} sm={12} xs={12}>
                {Array.isArray(couponInfo) &&
                  couponInfo.map((coupon: any, qrindex: number) => {
                    return (
                      <Row
                        className="align-items-start card-body"
                        key={qrindex}
                      >
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Product Name</p>
                            <span className="text-muted ">{coupon.name}</span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">GG No</p>
                            <span className="text-muted ">
                              {coupon.productNo}
                            </span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Points</p>
                            <span className="text-muted ">{coupon.points}</span>
                          </div>
                        </Col>
                        <Col xl={3} sm={4} xs={6}>
                          <div className="mb-2">
                            <p className="mb-0 f-12">Count</p>
                            <span className="text-muted ">
                              {coupon.couponCount}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </Layout>
  );
};

export default CouponsDetail;
