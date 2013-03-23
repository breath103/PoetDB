function UIDateOverall(Param) {
    /*\
     *  Div         : jQuery object of div for rendering workspace
     *  DateStart   : Display Date Start
     *  DateEnd     : Display Date End
     *      DateStart & DateEnd are set defaultly to current whole year
     *  nBundle     : Number to group elements
     *  BundleDateOffset : Don't set. For internel usage
     *  WidthElem   : Width of an element
     *  WidthStride : Stride of an element
     *  TotalDate   : Don't set. this is for internel
     *  Bottom      : Bottom position.
    \*/
    this.Elements = new Array();
    //this.Labels = new Array();

    for ( var elem in Param )
        this[elem] = Param[elem];

    var now = new Date();
    if (this.Div == undefined)
        this.Div = $(document);
    if (this.DateStart == undefined) {
        this.DateStart = new Date();
        this.DateStart.setMonth(0, 1);
    }

    if (this.DateEnd == undefined) {
        this.DateEnd = new Date();
        this.DateEnd.setMonth(11, 30);
    }
    if (this.nBundle == undefined) {
        this.nBundle = 3; // bundle by 3 elements
    }
    if (this.WidthElem == undefined) {
        this.WidthElem = this.Div.width() / (this.TotalDate / this.nBundle);
    }
    if (this.WidthStride == undefined) {
        this.WidthStride = Math.floor(this.Div.width() / (this.TotalDate / this.nBundle));
    }
    if (this.Bottom == undefined) {
        this.Bottom = this.Div.height();
    }

    this.BundleDateOffset = 0;
    this.BundleDateOffset = ((this.DateStart.valueOf() - this.ModDateByBundle(this.DateStart).valueOf()) / 1000 / 60 / 60 / 24);
    this.DateStart = this.ModDateByBundle(this.DateStart);
    //this.DateStart = this.ModDateByBundle(this.DateStart);
    //this.DateEnd = this.ModDateByBundle(this.DateEnd);
    
    this.TotalDate = (new Date(this.DateEnd - this.DateStart)).valueOf() / 1000 / 60 / 60 / 24;

    /*var fordate = new Date(this.DateStart.valueOf());
    for (; fordate.valueOf() <= this.DateEnd.valueOf(); fordate.setDate(fordate.getDate() + 1)) {
        if (fordate.getDate() == 1) {
            this.Div.append("<a>" + (fordate.getMonth()+1) + "월</a>");
            var label = $(this.Div.children()[this.Div.children().length - 1]);
            label.css("position", "absolute");

            label.css("left", this.WidthStride * Math.floor(fordate.valueOf() - this.DateStart.valueOf()) / 1000 / 60 / 60 / 24 / this.nBundle);
            label.css("top", this.Div.height());

            this.Labels[this.Labels.length] = label;
        }
    }*/

    this.Update();

    $(this.Div).resize({ui:this},
        function (event) {
            event.data.ui.Update();
        }
    );
}

UIDateOverall.prototype =
{
    ModDateByBundle: function (ModDate) {
        var newDate = new Date(ModDate.valueOf());
        /*newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);*/
        newDate = new Date(
        //Math.floor(
                ((Math.floor(
                            (Math.floor(newDate.valueOf() / 1000 / 60 / 60 / 24)
                            - this.BundleDateOffset) / this.nBundle
                        )
                    ) * (this.nBundle) + this.BundleDateOffset+1
                ) * 1000 * 60 * 60 * 24
        //)
        );
        return newDate;
    },
    Update: function () {
        //this.WidthElem = this.Div.width() / (this.TotalDate / this.nBundle);
        //this.WidthStride = Math.floor(this.Div.width() / (this.TotalDate / this.nBundle));
        for (var elem in this.Elements) {
            this.Elements[elem].Update();
        }
    },
    AddDate: function (ElementDate, Increase) {
        if (Increase == undefined) Increase = 1;

        ElementDate = this.ModDateByBundle(ElementDate)

        for (var i = 0; i < this.Elements.length; i++) {
            if (this.Elements[i].ElementDate.valueOf() == ElementDate.valueOf()) break;
        }
        if (i == this.Elements.length) {
            this.Elements[this.Elements.length] = new UIDateOverallElement(this, ElementDate);
            this.Elements[this.Elements.length - 1].SetCount(Increase);
        }
        else {
            this.Elements[i].IncCount(Increase);
        }
        return this.Elements[i];
    },
    GetElementIndexByDate: function (FindDate) {
        FindDate = this.ModDateByBundle(FindDate);
        for (var i = 0; i < this.Elements.length; i++) {
            if (this.Elements[i].ElementDate.valueOf() == FindDate.valueOf()) return this.Elements[i].Div;
        }
        return null;
    },
    DisplayDate: function (TargetDate) {
        if (!(this.DateStart.valueOf() <= TargetDate.valueOf() && TargetDate.valueOf() <= this.DateEnd.valueOf())) return;
        var origindate = TargetDate;
        TargetDate = this.ModDateByBundle(TargetDate);
        for (var i = 0; i < this.Elements.length; i++) {
            if (this.Elements[i].ElementDate.valueOf() == TargetDate.valueOf()) {
                break;
            }
        }
        if (i == this.Elements.length) {
            this.AddDate(TargetDate, 0);
        }
        // found
        if (this.Elements[i].Label == null) {
            this.Elements[i].Label = $(this.Div.append("<a>" + (origindate.getMonth() + 1) + "월" + origindate.getDate() + "일</a>").children()[this.Div.children().length - 1]);
            this.Elements[i].Label.css("left", this.Elements[i].Div.position().left);
            this.Elements[i].Label.css("top", this.Elements[i].Div.position().top - this.Elements[i].Label.height());
            this.Elements[i].Update();
        }
    }

};

function UIDateOverallElement(UIDateOverall, ElementDate) {
    this.Label = null;
    this.Count = 0;
    this.ElementDate = ElementDate;
    this.UIDateOverall = UIDateOverall;

    UIDateOverall.Div.append("<div></div>");
    this.Div = $(UIDateOverall.Div.children()[UIDateOverall.Div.children().length - 1]);
    this.Div.css("top", this.UIDateOverall.Div.height());
    this.Div.css("height", 0);
    this.Update();
    this.SetCount(0);
    this.Div.click(function () { alert("클릭!"); });
    //this.Div.css("top", 0);
    //this.Div.align({bottom:{at:1}});
}
UIDateOverallElement.prototype =
{
    Update: function () {
        var order = Math.floor((new Date(this.ElementDate - this.UIDateOverall.DateStart)).valueOf() / 1000 / 60 / 60 / 24);
        this.Div.css("overflow", "hidden");
        this.Div.css("position", "absolute");

        this.Div.css("width", this.UIDateOverall.WidthElem);
        this.Div.css("left", Math.round(this.UIDateOverall.WidthStride * order / this.UIDateOverall.nBundle));
        this.Div.css("background-color", "Black");

        this.SetCount();
    },

    SetCount: function (Count) {
        var objectiveheight = this.Div.height(),
            objectivetop = this.Div.position().top;
        var duration = 0;
        if (Count != undefined) {
            Count = Math.floor(Count);
            duration = (Count - this.Count) * 50;
            this.Count = Count;
            /*if (Count > this.UIDateOverall.Bottom) {
                objectiveheight = Math.floor(this.UIDateOverall.Bottom);
            } else*/ objectiveheight = Math.floor(Count);
        }

        //this.Div.css("top", this.UIDateOverall.Div.height() - heightset);
        var outerThis = this;
        var lam = function () {
            if (outerThis.Label != null) {
                outerThis.Label.css("position", "absolute");
                outerThis.Label.css("left", outerThis.Div.position().left);
                outerThis.Label.css("top", outerThis.Div.position().top - outerThis.Label.height());
            }
        };
        objectivetop = this.UIDateOverall.Bottom - objectiveheight;
        this.Div.animate({ top: objectivetop, height: objectiveheight },
            {
                duration: duration,
                step: lam
            }
        );
        //this.Label.animate({ left: this.Div.position().left, top: this.Div.position().top - this.Label.height() }, duration);
        //this.Label.css("left", this.Div.position().left);
        //this.Label.css("top", this.Div.position().top - this.Label.height());
    },

    IncCount: function (Increase) {
        if (Increase == undefined) Increase = 1;
        Increase = Math.floor(Increase);
        this.SetCount(this.Count + Increase);
    }

};