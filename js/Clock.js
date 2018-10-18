class Clock {
    constructor(_bgctx, _fgctx, _x,_y, _showdate = false, _showtime = true, _showtimeinbinary = false) {
        this.bgctx = _bgctx;
        this.fgctx = _fgctx;
        this.x = _x;
        this.y = _y;
        this.moduleWidth = 90;
        this.barMargin = 2;
        this.moduleSpacing = 20;
        this.barHeight = 20;
        this.moduleStartX = this.x - Math.round((this.moduleWidth + this.barMargin) / 2) - ((this.moduleWidth + this.barMargin) * 2) - this.moduleSpacing;
        this.leftSeparatorX = this.x - this.moduleWidth - Math.round(this.moduleSpacing / 2) - this.barMargin;
        this.rightSeparatorX = this.x + this.moduleWidth + Math.round(this.moduleSpacing / 2) + this.barMargin;
        this.secondsToHue = createRemap(0,60, 0,360);
        this.showDate = _showdate;
        this.showDigitalTime = _showtime;
        this.showTimeInBinary = _showtimeinbinary;  // Whether to show the binary of the actual time (Hours/Minutes/Seconds) or of the individual digits
        this.initHTMLInputs();
    }

    showTime(_time) {
        const timeToShow = _time || new Date(),

            timeHMS = [
                timeToShow.getHours(),
                timeToShow.getMinutes(),
                timeToShow.getSeconds()
            ],
            millis = timeToShow.getMilliseconds(),
            barHue = Math.floor(this.secondsToHue(timeHMS[2] + (millis / 1000.0))),
            separator = timeHMS[2] % 2,
            timeText = this.makeTimeString(timeHMS),
            dateText = timeToShow.toLocaleDateString(undefined,{ weekday : "long", year : "numeric", month : "long", day : "numeric"}).split(", ");

        this.showModules(timeText, barHue);

        if(separator && this.showDigitalTime) {
            this.showDigitalText(":", this.leftSeparatorX,this.y, "100");
            this.showDigitalText(":", this.rightSeparatorX,this.y, "100");
        }
        
        if(this.showDate) {
            this.showDigitalText(dateText[0]+" "+dateText[1]+", "+dateText[2], this.x,this.y - 58, "25");
        }
    }

    showModules(_timeText, _hue) {
        let timeBinaryString = this.makeBinaryTimeString(_timeText),
            nibble,
            index = 0,
            moduleLeftX;
        
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 2; j++) {
                nibble = timeBinaryString.substr(index * 4, 4);
                moduleLeftX = this.moduleStartX + ((this.moduleWidth + this.barMargin) * index) + (this.moduleSpacing * i);
                this.binaryModule(moduleLeftX, nibble, _timeText[index], _hue);

                index++;
            }
        }
    }

    binaryModule(_x, _binaryDigit, _digit, _hue) {
        let moduleYStart = this.y - ((this.barHeight + this.barMargin) / 2) - (this.barHeight + this.barMargin),
            hueOffsetHSL,
            moduleYCurrent;

        for(let i = 0; i < 4; i++) {
            if(_binaryDigit[i] == "1") {
                hueOffsetHSL = `hsl(${(_hue + (i * 4)) % 360},100%,50%)`;
                moduleYCurrent = moduleYStart + ((this.barHeight + this.barMargin) * i);
                colorRect(this.bgctx, _x,moduleYCurrent, this.moduleWidth,this.barHeight, hueOffsetHSL, "center", {shadowColor: hueOffsetHSL, shadowBlur: 3, shadowOffsetX: 0, shadowOffsetY: 0});
            }
        }

        if(this.showDigitalTime) {
            this.showDigitalText(_digit, _x,this.y, "100", {shadowColor: "black", shadowBlur: 10, shadowOffsetX: 0, shadowOffsetY: 0});
        }
    }

    numToBinaryString(_num, _length = 8) {
        if(_num < 0 || _num > 255 || _num % 1 !== 0) {
            throw new Error("Not a valid byte: " + _num);
        }

        return ("0000000" + _num.toString(2)).substr(-_length);
    }

    makeTimeString(_array) {
        return _array.reduce((timeString, item) => timeString + ("0" + item.toString()).substr(-2), "");
    }

    makeBinaryTimeString(_timeText) {
        let binaryModifier = this.boolTo0or1(this.showTimeInBinary) + 1,
            binaryTimeString = "",
            tempNum;

        for(let i = 0, len = _timeText.length; i < len; i += binaryModifier) {
            tempNum = _timeText.substr(i, binaryModifier);
            binaryTimeString += this.numToBinaryString(+tempNum, 4 * binaryModifier);
        }
        return binaryTimeString;
    }

    boolTo0or1(bool) {
        if(bool) {
            return 1;
        } else {
            return 0;
        }
    }

    showDigitalText(_text, _x,_y, _size, _shadowprops = {shadowColor: "black", shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0}) {
        colorText(this.fgctx, _text, _x,_y, "white", {fontStyle: _size+"px Digital-7 Mono, monospace", textAlign: "center", textBaseline: "middle"}, _shadowprops);
    }

    initHTMLInputs() {
        const inputs = document.querySelectorAll("input");

        for(let i = 0, len = inputs.length; i < len; i++) {
            inputs[i].addEventListener("change", this.handleInputEvents.bind(this));

            switch(inputs[i].name) {
                case "binaryDisplayType":
                    if(inputs[i].value == "Binary Time") {
                        inputs[i].checked = this.showTimeInBinary;
                    } else if(inputs[i].value == "Binary-Coded Decimal") {
                        inputs[i].checked = !this.showTimeInBinary;
                    }
                break;
                case "showTime":
                    inputs[i].checked = this.showDigitalTime;
                break;
                case "showDate":
                    inputs[i].checked = this.showDate;
                break;
            }
        }
    }

    handleInputEvents(event) {
        switch(event.target.name) {
            case "binaryDisplayType":
                if(event.target.value == "Binary Time") {
                    this.showTimeInBinary = event.target.checked;
                } else if(event.target.value == "Binary-Coded Decimal") {
                    this.showTimeInBinary = !event.target.checked;
                }
            break;
            case "showTime":
                this.showDigitalTime = event.target.checked;
            break;
            case "showDate":
                this.showDate = event.target.checked;
            break;
        }
    }
}