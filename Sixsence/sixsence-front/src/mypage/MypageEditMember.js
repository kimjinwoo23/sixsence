import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MypageModal from "./MypageModal";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./MypageCss.css";

Modal.setAppElement("#root");

const MypageEditMember = () => {
  const loginMem = JSON.parse(localStorage.getItem("loginMember"));
  const [checkPw, setCheckPw] = useState(false);
  const [inputPw, setInputPw] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelList, setCancelList] = useState("");
  const navi = useNavigate();

  const [updatePw1, setUpdatePw1] = useState("");
  const [updatePw2, setUpdatePw2] = useState("");
  const [updatePhone, setUpdatePhone] = useState(loginMem.memberPhone);
  const phoneRegex = /^(01[016789])-\d{3,4}-\d{4}$/;
  const passwordRegex =
    /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,15}$/;

  const [checkUpdatePw1, setCheckUpdatePw1] = useState(false);
  const [checkUpdatePw2, setCheckUpdatePw2] = useState(false);
  const [checkUpdatePhone, setCheckUpdatePhone] = useState(false);

  const getAddress = loginMem.memberAddress.split(',');
  const [address, setAddress] = useState(getAddress[0]);
  const [addAddress, setAddAddress] = useState(getAddress[1]);
  const [finalAddress, setFinalAddress] = useState("");

  const checkPwBtn = () => {
    if (inputPw === loginMem.memberPw) {
      setCheckPw(true);
    } else {
      alert("비밀번호가 일치하지 않습니다.\n다시 입력해주세요.");
      setInputPw("");
    }
  };

  const openModal = (cancel) => {
    setModalOpen(true);
    setCancelList(cancel);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleButtonClick = (input) => {
    if (input !== "Cancel") {
      setTimeout(function () {
        editMemberInfo();
      }, 500);
      navi('/mypageMain');
    }
    closeModal();
  };

  useEffect(() => {}, [checkPw]);

  const handleUpdatePw1 = (input) => {
    if (passwordRegex.test(input)) {
      setCheckUpdatePw1(true);
    } else {
      setCheckUpdatePw1(false);
    }
  };

  const handleUpdatePw2 = (input) => {
    if (passwordRegex.test(input) && updatePw1 === input) {
      setCheckUpdatePw2(true);
    } else {
      setCheckUpdatePw2(false);
    }
  };

  useEffect(() => {
    handleUpdatePw1(updatePw1);
  }, [updatePw1]);

  useEffect(() => {
    handleUpdatePw2(updatePw2);
  }, [updatePw1, updatePw2]);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: handleComplete,
    }).open();
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
  };

  useEffect(() => {
    setFinalAddress(`${address}, ${addAddress}`);
  }, [address, addAddress]);

  const handleUpdatePhone = (input) => {
    if(phoneRegex.test(input)){
        setCheckUpdatePhone(true);
    } else {
        setCheckUpdatePhone(false);
    }
  }

  useEffect(() => {
    handleUpdatePhone(updatePhone);
  }, [updatePhone])

  const editMemberInfo = () => {
    if (!checkUpdatePw1 || !checkUpdatePw2) {
      alert("비밀번호가 양식에 일치하지 않습니다.\n다시 확인해주세요.");
      return;
    }

    if (!checkUpdatePhone) {
        alert("전화번호가 양식에 일치하지 않습니다.\n다시 확인해주세요.");
        return;
    }

    if(!(addAddress.trim().length > 0)){
        alert("상세주소가 비어있습니다.\n다시 확인해주세요.");
        return;
    }
    
    const updateMemberData = {
        memberNo: loginMem.memberNo,
        memberAddress: finalAddress,
        memberPw: updatePw1,
        memberPwCheck: updatePw2,
        memberPhone: updatePhone
    }

    axios.put("/editMember", updateMemberData)
    .then(response => {
        alert("회원 정보가 정상적으로 수정되었습니다.");
        getLoginMember();
    })
    .catch(error => {
        console.log("에러 발생 : ", error);
        alert("회원 정보 수정 중 문제가 발생했습니다.");
    })
  };

  const getLoginMember = () => {
    axios.get("/getLoginMember", { params: { memberNo: loginMem.memberNo } })
    .then((response) => {
      localStorage.setItem("loginMember", JSON.stringify(response.data));
      window.dispatchEvent(new Event("storageChange"));
    })
    .catch((err) => alert("회원정보 불러오던 중 에러 발생!"));
  }

  return (
    <div className="contentMainContainer">
      {checkPw === false ? (
        <div className="outBox">
          <div className="inBox">
            <div className="checkPwBox">
              <p>
                개인 정보를 안전하게 보호하기위해 <br />
                비밀번호를한번 더 입력해주세요.
              </p>
              <input
                type="password"
                value={inputPw}
                placeholder="비밀번호 입력"
                onChange={(e) => setInputPw(e.target.value)}
              />
              <br />
              <button className="checkPwBtn" onClick={checkPwBtn}>
                확인
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="editMemberContainer">
          <h2>회원정보 수정</h2>
          <table className="editMemberTable">
            <tbody>
              <tr>
                <td className="editMemberTdLeft">아이디</td>
                <td className="editMemberTdRight">{loginMem.memberId}</td>
              </tr>
              <tr>
                <td className="editMemberTdLeft editAttrPw">비밀번호</td>
                <td className="editMemberTdRight">
                  <input
                    type="password"
                    value={updatePw1}
                    onChange={(e) => setUpdatePw1(e.target.value)}
                    placeholder="비밀번호를 입력해주세요."
                    className="inputPw"
                  />
                  <div>
                    {checkUpdatePw1 ? (
                      <p
                        style={{
                          color: "green",
                          margin: "0",
                          fontSize: "13px",
                        }}
                      >
                        올바른 형식입니다.
                      </p>
                    ) : (
                      <p
                        style={{ color: "red", margin: "0", fontSize: "13px" }}
                      >
                        비밀번호는 10 ~ 15 자, 특수문자를 포함해야 합니다.
                      </p>
                    )}
                  </div>
                  <input
                    type="password"
                    value={updatePw2}
                    onChange={(e) => setUpdatePw2(e.target.value)}
                    placeholder="입력하신 비밀번호를 다시 한번 입력해주세요."
                    className="inputPw"
                  />
                  <div>
                    {updatePw2.length > 0 ? (
                      checkUpdatePw2 ? (
                        <p
                          style={{
                            color: "green",
                            margin: "0",
                            fontSize: "13px",
                          }}
                        >
                          비밀번호가 일치합니다.
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "red",
                            margin: "0",
                            fontSize: "13px",
                          }}
                        >
                          비밀번호가 일치하지 않습니다.
                        </p>
                      )
                    ) : (
                      " "
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">이름</td>
                <td className="editMemberTdRight">{loginMem.memberName}</td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">생년월일</td>
                <td className="editMemberTdRight">
                  {loginMem.memberBirth.substring(0, 6)}
                </td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">성별</td>
                <td className="editMemberTdRight">
                  {loginMem.memberGender === "Male" ? "남자" : "여자"}
                </td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">나이</td>
                <td className="editMemberTdRight">{loginMem.memberAge}</td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">전화번호</td>
                <td className="editMemberTdRight">
                    <input type="text" value={updatePhone} onChange={e => setUpdatePhone(e.target.value)} />
                    <div>
                        {checkUpdatePhone ? (
                      <p
                        style={{
                          color: "green",
                          margin: "0",
                          fontSize: "13px",
                        }}
                      >
                        올바른 형식입니다.
                      </p>
                    ) : (
                      <p
                        style={{ color: "red", margin: "0", fontSize: "13px" }}
                      >
                        전화번호 양식은 010-****-**** 입니다.
                      </p>
                    )}
                    </div>
                </td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">이메일</td>
                <td className="editMemberTdRight">{loginMem.memberEmail}</td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">주소</td>
                <td className="editMemberTdRight editAttrAdress">
                  <input type="text" value={address} />
                  <button onClick={openPostcode}>주소 검색</button>
                  <br />
                  <input
                    type="text"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    placeholder="상세 주소를 입력해주세요."
                  />
                </td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">등급</td>
                <td className="editMemberTdRight">{loginMem.memberGrade}</td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">결제횟수</td>
                <td className="editMemberTdRight">{loginMem.memberPayCount}</td>
              </tr>
              <tr>
                <td className="editMemberTdLeft">포인트</td>
                <td className="editMemberTdRight">{loginMem.memberPoint}</td>
              </tr>
            </tbody>
          </table>
          <div className="editBtnBox">
            <button onClick={openModal} className="editMainBtn">
              수정하기
            </button>
            <button
              onClick={(e) => navi("/mypageMain")}
              className="editMainBtn"
            >
              이전으로
            </button>
          </div>
        </div>
      )}
      <MypageModal
        modalOpen={modalOpen}
        cancelList={cancelList}
        handleButtonClick={handleButtonClick}
        handleComment={"editMember"}
      />
    </div>
  );
};

export default MypageEditMember;
