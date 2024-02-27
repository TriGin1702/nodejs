function Payment({}) {
  const main = document.querySelector("#pay");
  const Payment = document.createElement("div");
  Payment.onclick = function (e) {
    if (e.target.closest(".close")) {
      main.removeChild(Payment);
    }
  };
  Payment.innerHTML = `<div
class="notify"
style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center;"
>
<div
  class="notify_overlay"
  style="background-color: rgba(0, 0, 0, 0.4); width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"
>
  <div
    class="notify_body"
    style="display: block; width: 40%; height: 50%; background-color:aliceblue; border-radius: 4px; border: 1px solid black; padding: 20px;  position: relative;"
  >
    <button class="close"
      style="position: absolute; top:0; right:0; background-color:red; border-radius: 4px; border: 1px solid black"
    ><i class="bi bi-x-lg" style="color: aliceblue;"></i></button>
    <form class="row g-3">
      <div class="col-md-6">
        <label for="validationDefault01" class="form-label">First name</label>
        <input
          type="text"
          class="form-control"
          id="validationDefault01"
          value="Mark"
          required
        />
      </div>

      <div class="col-md-6">
        <label for="validationDefault03" class="form-label">Phone Number</label>
        <input
          type="text"
          class="form-control"
          id="validationDefault03"
          required
        />
      </div>
      <div
        style="display: flex; justify-content:center; align-items:center; width: 100%; height: 100%"
      >
        <div class="col-md-3" style=" margin: 12px 0">
          <label
            for="validationDefault04"
            class="form-label"
            style="display: block;"
          >City</label>
          <select class="form-select" id="validationDefault04" required>
            <option value="">Choose...</option>
            <option value="">Choose...</option>
            <option value="">Choose...</option>
          </select>
        </div>
        <div class="col-md-3" style=" margin: 12px 0">
          <label
            for="validationDefault04"
            class="form-label"
            style="display: block;"
          >District</label>
          <select class="form-select" id="validationDefault04" required>
            <option value="">Choose...</option>
            <option value="">Choose...</option>
            <option value="">Choose...</option>
          </select>
        </div>
        <div class="col-md-6" style=" margin: 12px 0">
          <label for="validationDefault04" class="form-label">Address</label>
          <input type="text" class="form-control" />
        </div>

      </div>
      <div
        class="col-12"
        style="display: inline-flex; justify-content:stretch; align-items:center; width: 100%; margin: 12px 0"
      >
        <label
          class="form-check-label"
          for="invalidCheck2"
          style="margin-right:12px;"
        >
          Choose your Payment
        </label>
        <div class="form-check form-check-inline" style="margin: 0 12px;">
          <img
            src="/image/momo.png"
            alt=""
            srcset=""
            style="width: 100%; height: 36px;"
          />
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="option1"
          />
        </div>
        <div class="form-check form-check-inline" style="margin: 0 12px;">
          <img
            src="/image/vnpay.png"
            alt=""
            srcset=""
            style="width: 100%; height: 36px;"
          />
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="option2"
          />
        </div>
        <div class="form-check form-check-inline" style="margin: 0 12px;">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio3"
            value="option3"
          />
          <label
            class="form-check-label"
            for="inlineRadio3"
            style="padding-bottom: 2px;"
          >Thanh toán khi nhận hàng</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="invalidCheck2"
            required
          />
          <label class="form-check-label" for="invalidCheck2">
            Agree to terms and conditions
          </label>
        </div>
      </div>
      <div
        class="col-12"
        style="display: flex; justify-content: flex-end; margin-top:12px;"
      >
        <button class="btn btn-primary" type="submit">Submit form</button>
      </div>
    </form>
  </div>
</div>
</div>
`;
  main.appendChild(Payment);
}

function showPayment() {
  Payment({});
}
