/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/core/Injector.ts"/>
/// <reference path="supportClasses/TextBase.ts"/>
/// <reference path="../events/UIEvent.ts"/>
/// <reference path="../../../egret/text/VerticalAlign.ts"/>

module ns_egret {

	export class Label extends TextBase{
		public constructor(){
			super();
			this.addEventListener(UIEvent.UPDATE_COMPLETE, this.updateCompleteHandler, this);
		}

		/**
		 * 一个验证阶段完成
		 */		
		private updateCompleteHandler(event:UIEvent):void{
			this.lastUnscaledWidth = NaN;
		}
		
		private _maxDisplayedLines:number = 0;
		/**
		 * 最大显示行数,0或负值代表不限制。
		 */
		public get maxDisplayedLines():number{
			return this._maxDisplayedLines;
		}
		
		public set maxDisplayedLines(value:number):void{
			if(this._maxDisplayedLines==value)
				return;
			this._maxDisplayedLines = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * 上一次测量的宽度 
		 */		
		private lastUnscaledWidth:number = NaN;
		
		private _padding:number = 0;
		/**
		 * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
		 * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
		 */
		public get padding():number{
			return this._padding;
		}
		public set padding(value:number):void{
			if(this._padding==value)
				return;
			this._padding = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private _paddingLeft:number = NaN;
		/**
		 * 文字距离左边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingLeft():number{
			return this._paddingLeft;
		}
		
		public set paddingLeft(value:number):void{
			if (this._paddingLeft == value)
				return;
			
			this._paddingLeft = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		private _paddingRight:number = NaN;
		/**
		 * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingRight():number{
			return this._paddingRight;
		}
		
		public set paddingRight(value:number):void{
			if (this._paddingRight == value)
				return;
			
			this._paddingRight = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		private _paddingTop:number = NaN;
		/**
		 * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingTop():number{
			return this._paddingTop;
		}
		
		public set paddingTop(value:number):void{
			if (this._paddingTop == value)
				return;
			
			this._paddingTop = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		private _paddingBottom:number = NaN;
		/**
		 * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingBottom():number{
			return this._paddingBottom;
		}
		
		public set paddingBottom(value:number):void{
			if (this._paddingBottom == value)
				return;
			
			this._paddingBottom = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		/**
		 * @inheritDoc
		 */
		public measure():void{
			//先提交属性，防止样式发生改变导致的测量不准确问题。
			if(this.invalidatePropertiesFlag)
				this.validateProperties();
			if (this.isSpecialCase()){
				if (isNaN(this.lastUnscaledWidth)){
					this.oldPreferWidth = NaN;
					this.oldPreferHeight = NaN;
				}
				else{
					this.measureUsingWidth(this.lastUnscaledWidth);
					return;
				}
			}
			
			var availableWidth:number;
			
			if (!isNaN(this.explicitWidth))
				availableWidth = this.explicitWidth;
			else if (this.maxWidth!=10000)
				availableWidth = this.maxWidth;
			
			this.measureUsingWidth(availableWidth);
		}
		
		/**
		 * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
		 */		
		private isSpecialCase():boolean{
			return this._maxDisplayedLines!=1&&
				(!isNaN(this.percentWidth) || (!isNaN(this.left) && !isNaN(this.right))) &&
				isNaN(this.explicitHeight) &&
				isNaN(this.percentHeight);
		}
		
		/**
		 * 使用指定的宽度进行测量
		 */	
		private measureUsingWidth(w:number):void{
			var originalText:string = this._textField.text;
			if(this._isTruncated||this.textChanged){
				this._textField.text = this._text;
			}
			
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;

            this._textField.width = NaN;
            this._textField.height = NaN;
			if (!isNaN(w)){
				this._textField.width = w - paddingL - paddingR;
				this.measuredWidth = Math.ceil(this._textField.width);
				this.measuredHeight = Math.ceil(this._textField.height);
			}
			else{
				this.measuredWidth = Math.ceil(this._textField.width);
				this.measuredHeight = Math.ceil(this._textField.height);
			}
			
			if(this._maxDisplayedLines>0&&this._textField.numLines>this._maxDisplayedLines){
				var lineM:TextLineMetrics = this._textField.getLineMetrics(0);
				this.measuredHeight = lineM.height*this._maxDisplayedLines-lineM.leading+4;
			}
			
			this.measuredWidth += paddingL + paddingR;
			this.measuredHeight += paddingT + paddingB;
			
			if(this._isTruncated){
				this._textField.$text = originalText;
				this.applyRangeFormat();
			}
		}
		
		/**
		 * 记录不同范围的格式信息 
		 */		
		private rangeFormatDic:Dictionary;
		
		/**
		 * 范围格式信息发送改变标志
		 */		
		private rangeFormatChanged:boolean = false;
		
		/**
		 * 将指定的格式应用于指定范围中的每个字符。
		 * 注意：使用此方法应用的格式只能影响到当前的文字内容，若改变文字内容，所有文字将会被重置为默认格式。
		 * @param format 一个包含字符和段落格式设置信息的 TextFormat 对象。
		 * @param beginIndex 可选；一个整数，指定所需文本范围内第一个字符的从零开始的索引位置。
		 * @param endIndex 可选；一个整数，指定所需文本范围后面的第一个字符。
		 * 如果指定 beginIndex 和 endIndex 值，则更新索引从 beginIndex 到 endIndex-1 的文本。
		 */		
		public setFormatOfRange(format:TextFormat, beginIndex:number=-1, endIndex:number=-1):void{
			if(!this.rangeFormatDic)
				this.rangeFormatDic = new Dictionary;
			if(!this.rangeFormatDic[beginIndex])
				this.rangeFormatDic[beginIndex] = new Dictionary;
			this.rangeFormatDic[beginIndex][endIndex] = Label.cloneTextFormat(format);
			
			this.rangeFormatChanged = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * 克隆一个文本格式对象
		 */		
		private static cloneTextFormat(tf:TextFormat):TextFormat{
			return new TextFormat(tf.font, tf.size, tf.color, tf.bold, tf.italic,
				tf.underline, tf.url, tf.target, tf.align,
				tf.leftMargin, tf.rightMargin, tf.indent, tf.leading);
		}
		
		
		/**
		 * 应用范围格式信息
		 */
		private applyRangeFormat(expLeading:any=null):void{
			this.rangeFormatChanged = false;
			if(!this.rangeFormatDic||!this._textField||!this._text)
				return;
			var useLeading:boolean = <boolean> (expLeading!=null);
			for(var beginIndex:any in this.rangeFormatDic){
				var endDic:Dictionary = <Dictionary> (this.rangeFormatDic[beginIndex]);
				if(endDic){
					for(var index:any in endDic){
						if(!endDic[index])
							continue;
						var oldLeading:any;
						if(useLeading){
							oldLeading = (<TextFormat> (endDic[index])).leading;
							(<TextFormat> (endDic[index])).leading = expLeading;
						}
						var endIndex:number = index;
						if(endIndex>this._textField.text.length)
							endIndex = this._textField.text.length;
						try{
							this._textField.$setTextFormat(endDic[index],beginIndex,endIndex);
						}
						catch(e:Error){}
						if(useLeading){
							(<TextFormat> (endDic[index])).leading = oldLeading;
						}
					}
				}
			}
		}
		
		
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number,unscaledHeight:number):void{
			this.$updateDisplayList(unscaledWidth,unscaledHeight);
			
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			this._textField.x = paddingL;
			this._textField.y = paddingT;
			if (this.isSpecialCase()){
				var firstTime:boolean = isNaN(this.lastUnscaledWidth) ||
					this.lastUnscaledWidth != unscaledWidth;
				this.lastUnscaledWidth = unscaledWidth;
				if (firstTime){
					this.oldPreferWidth = NaN;
					this.oldPreferHeight = NaN;
					this.invalidateSize();
					return;
				}
			}
			//防止在父级validateDisplayList()阶段改变的text属性值，
			//接下来直接调用自身的updateDisplayList()而没有经过measu(),使用的测量尺寸是上一次的错误值。
			if(this.invalidateSizeFlag)
				this.validateSize();
			
			if(!this._textField.visible)//解决初始化时文本闪烁问题
				this._textField.visible = true;
			if(this._isTruncated){
				this._textField.$text = this._text;
				this.applyRangeFormat();
			}
			
			this._textField.scrollH = 0;
			this._textField.scrollV = 1;
			
			this._textField.$width = unscaledWidth - paddingL - paddingR;
			var unscaledTextHeight:number = unscaledHeight - paddingT - paddingB;
			this._textField.$height = unscaledTextHeight;
			
			if(this._maxDisplayedLines==1)
				this._textField.wordWrap = false;
			else if (Math.floor(this.width) < Math.floor(this.measuredWidth))
				this._textField.wordWrap = true;
			
			this._textWidth = this._textField.textWidth;
			this._textHeight = this._textField.textHeight;
			
			if(this._maxDisplayedLines>0&&this._textField.numLines>this._maxDisplayedLines){
				var lineM:TextLineMetrics = this._textField.getLineMetrics(0);
				var h:number = lineM.height*this._maxDisplayedLines-lineM.leading+4;
				this._textField.$height = Math.min(unscaledTextHeight,h);
			}
			if(this._verticalAlign==VerticalAlign.JUSTIFY){
				this._textField.$setTextFormat(this.defaultTextFormat);
				this.applyRangeFormat(0);
			}
			
			if(this._truncateToFit){
				this._isTruncated = this.truncateTextToFit();
				if (!this.toolTipSet)
					super.toolTip = this._isTruncated ? _text : null;
			}
			if(this._textField.textHeight>=unscaledTextHeight)
				return;
			if(this._verticalAlign==VerticalAlign.JUSTIFY){
				if(this._textField.numLines > 1){
					this._textField.$height = unscaledTextHeight;
					var extHeight:number = Math.max(0,unscaledTextHeight-4 - this._textField.textHeight);
					this.defaultTextFormat.leading = Math.floor(extHeight/(this._textField.numLines-1));
					this._textField.$setTextFormat(this.defaultTextFormat);
					this.applyRangeFormat(this.defaultTextFormat.leading);
					this.defaultTextFormat.leading = 0;
				}
			}
			else{
				var valign:number = 0;
				if(this._verticalAlign==VerticalAlign.MIDDLE)
					valign = 0.5;
				else if(this._verticalAlign==VerticalAlign.BOTTOM)
					valign = 1;
				this._textField.y += Math.floor((unscaledTextHeight-this._textField.textHeight)*valign);
				this._textField.$height = unscaledTextHeight-this._textField.y;
			}
		}
		
		
		private _isTruncated:boolean = false;
		
		/**
		 * 文本是否已经截断并以...结尾的标志。注意：当使用htmlText显示文本时，始终直接截断文本,不显示...。
		 */		
		public get isTruncated():boolean{
			return this._isTruncated;
		}
		
		private _truncateToFit:boolean = true;
		/**
		 * 如果此属性为true，并且Label控件大小小于其文本大小，则使用"..."截断 Label控件的文本。
		 * 反之将直接截断文本。注意：当使用htmlText显示文本或设置maxDisplayedLines=1时，始终直接截断文本,不显示...。
		 */
		public get truncateToFit():boolean{
			return this._truncateToFit;
		}
		
		public set truncateToFit(value:boolean):void{
			if(this._truncateToFit==value)
				return;
			this._truncateToFit = value;
			this.invalidateDisplayList();
		}
		
		
		/**
		 * 截断超过边界的字符串，使用"..."结尾
		 */		
		private truncateTextToFit():boolean{
			if(this.isHTML)
				return false;
			var truncationIndicator:string = "...";
			var originalText:string = this.text;
			
			var expLeading:any = this.verticalAlign==VerticalAlign.JUSTIFY?0:null;
			
			try{
				var lineM:TextLineMetrics = this._textField.getLineMetrics(0);
				var realTextHeight:number = this._textField.height-4+this._textField.leading;
				var lastLineIndex:number =<number> (realTextHeight/lineM.height);
			}
			catch(e:Error){
				lastLineIndex = 1;
			}
			if(lastLineIndex<1)
				lastLineIndex = 1;
			if(this._textField.numLines>lastLineIndex&&this._textField.textHeight>this._textField.height){
				var offset:number = this._textField.getLineOffset(lastLineIndex);
				originalText = originalText.substr(0,offset);
				this._textField.$text = originalText+truncationIndicator;
				this.applyRangeFormat(expLeading);
				while (originalText.length > 1 && this._textField.numLines>lastLineIndex){
					originalText = originalText.slice(0, -1);
					this._textField.$text = originalText+truncationIndicator;
					this.applyRangeFormat(expLeading);
				}
				return true;
			}
			return false;
		}
		
		/**
		 * @inheritDoc
		 */
		public createTextField():void{
			super.createTextField();
			this._textField.wordWrap = true;
			this._textField.multiline = true;
			this._textField.visible = false;
			this._textField.mouseWheelEnabled = false;
		}
		
		/**
		 * 文字内容发生改变
		 */		
		public textField_textModifiedHandler(event:Event):void{
			super.textField_textModifiedHandler(event);
			this.rangeFormatDic = null;
		}
	}
}