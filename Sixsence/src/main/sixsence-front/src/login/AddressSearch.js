import { useState, useEffect } from "react";

const AddressSearch = ({ onAddressChange }) => {
  const [address, setAddress] = useState(""); // 기본 주소
  const [additionalAddress, setAdditionalAddress] = useState(""); // 추가 주소
  const [finalAddress, setFinalAddress] = useState(""); // 최종 주소

  // 주소 검색 완료 후 호출되는 함수
  const handleComplete = (data) => {
    let fullAddress = data.address; // 기본 주소
    let extraAddress = ""; // 추가 주소

    if (data.addressType === "R") { // 도로명 주소일 경우
      if (data.bname) {
        extraAddress += data.bname;
      }
      if (data.buildingName) {
        extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
  };

  // 주소 검색 버튼 클릭 시 주소 검색 팝업 열기
  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: handleComplete,
    }).open();
  };

  // 주소가 변경될 때 최종 주소를 업데이트하고 부모 컴포넌트에 전달
  useEffect(() => {
    const combinedAddress = `${address} , [${additionalAddress}]`;
    setFinalAddress(combinedAddress);
    onAddressChange(combinedAddress); // 부모 컴포넌트로 최종 주소 전달
  }, [address, additionalAddress, onAddressChange]);

  return (
    <div>
      <button className="btna btn-dark" onClick={openPostcode}>주소 검색</button>
      {address && (
        <div>
          <input
            type="text"
            placeholder="추가 주소 입력 (예 : 아파트 동 / 호수)"
            value={additionalAddress}
            onChange={(e) => setAdditionalAddress(e.target.value)}
          />
          <div>선택한 주소: {address}</div>
        </div>
      )}
      {address && additionalAddress && (
        <>
          <h5>{finalAddress}</h5>
          <input type="hidden" value={finalAddress} />
        </>
      )}
    </div>
  );
};

export default AddressSearch;